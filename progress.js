'use strict'; // eslint-disable-line

const fs = require('fs');
const request = require('request');
const progress = require('request-progress');
const downloadDir = 'downloads/';
const Nedb = require('nedb');
const files = new Nedb({
  filename: 'db/data.db',
  autoload: true,
});

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

class Downloader {
  constructor() {
    this.count = 0;
  }

  download(url) {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    console.log('[Downloading', filename, ']');
    const self = this;
    // Note that the options argument is optional
    progress(request(url), {
        throttle: 2000, // Throttle the progress event to 2000ms, defaults to 1000ms
        delay: 1000, // Only start to emit after 1000ms delay, defaults to 0ms
      }).on('progress', function(state) {
        const file = {
          filename: filename,
          url: downloadDir + filename,
          received: state.received,
          total: state.total, // The properties {precent, total} can be null if response does not contain the content-length header
          percent: state.percent,
          done: false,
        };

        files.update({
          filename: filename
        }, file, {
          upsert: true
        }, (err, numReplaced, upsert) => {
          if (err) {
            console.log('Failed upsert during progress:', err);
          }
        });
      }).on('error', (err) => {
        console.log('[Error on download]\n', err);
        if (self.count < 3) {
          console.log('Retrying');
          self.download(url);
          self.count++;
        } else {
          console.log('[Failed to download after 3 attempts]');
        }
      })
      .pipe(fs.createWriteStream(downloadDir + filename))
      .on('error', (err) => {
        console.log('[Error on pipe]\n', err);
      })
      .on('close', (err) => {
        files.find({
          filename: filename
        }, (err, docs) => {
          // A small file wont even see 'progress'
          if (err) {
            console.log('[Error on Close: Failed to find', filename, ']\n', err);
          }

          const file = {
            filename: filename,
            url: downloadDir + filename,
            received: 10240,
            total: 10240,
            percent: 100,
            done: true,
          };

          if (docs && docs.length > 0) {
            file.total = docs[0].total;
            file.received = docs[0].total;
          }

          files.update({
            filename: filename
          }, file, {
            upsert: true
          }, (err, numReplaced, upsert) => {
            if (err) {
              console.log('[Error: Failed upsert during close]\n', err);
            }
          });
          console.log('[Finished:', filename, ']');
        });
      })
  }

  getDownloadList() {
    return new Promise((resolve, reject) => {
      files.find({}, (err, docs) => {
        if (err) {
          reject(Error('[Error retrieving file list]\n', err));
        } else {
          // Resolve the promise with the response text
          resolve(docs);
        }
      });
    });
  }

  removeAllCompleted(onSuccess) {
    files.remove({
      done: true,
    }, {
      multi: true, // Remove multiple documents
    }, (err, numRemoved) => {
      if (err) {
        console.log('[Error removing completed downloads]\n', err);
      } else {
        onSuccess(numRemoved);
      }
    });
  }

  removeCompleted(downloadId, onSuccess) {
    files.remove({
      _id: downloadId,
    }, {}, (err, numRemoved) => {
      if (err) {
        console.log('[Error removing completed download with id', numRemoved, ']\n', err);
      } else {
        onSuccess(numRemoved);
      }
    });
  }
}

module.exports = new Downloader();
