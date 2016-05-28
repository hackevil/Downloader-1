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
const debug = (value) => console.log(value);

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

class Downloader {
  constructor() {
    this.count = 0;
  }

  download(url) {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    debug('[Downloading', filename, ']');
    // Note that the options argument is optional
    progress(request(url), {
      // Throttle the progress event to 2000ms, defaults to 1000ms
      throttle: 2000,
      // Only start to emit after 1000ms delay, defaults to 0ms
      delay: 1000,
    })
    .on('progress', (state) => {
      const file = {
        filename,
        url: downloadDir + filename,
        received: state.received,
        // The properties {precent, total} can be null if response
        // does not contain the content-length header
        total: state.total,
        percent: state.percent,
        done: false,
      };

      files.update({
        filename,
      }, file, {
        upsert: true,
      }, (err) => {
        if (err) {
          debug('Failed upsert during progress:', err);
        }
      });
    })
    .on('error', (err) => {
      debug('[Error on download]\n', err);
      if (this.count < 3) {
        debug('Retrying');
        this.download(url);
        this.count++;
      } else {
        debug('[Failed to download after 3 attempts]');
      }
    })
    .pipe(fs.createWriteStream(downloadDir + filename))
    .on('error', (err) => {
      debug('[Error on pipe]\n', err);
    })
    .on('close', () => {
      files.find({
        filename,
      }, (err, docs) => {
        // A small file wont even see 'progress'
        if (err) {
          debug('[Error on Close: Failed to find', filename, ']\n', err);
        }

        const file = {
          filename,
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
          filename,
        }, file, {
          upsert: true,
        }, (error) => {
          if (error) {
            debug('[Error: Failed upsert during close]\n', err);
          }
        });
        debug('[Finished:', filename, ']');
      });
    });
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
        debug('[Error removing completed downloads]\n', err);
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
        debug('[Error removing completed download with id', numRemoved, ']\n', err);
      } else {
        onSuccess(numRemoved);
      }
    });
  }
}

module.exports = new Downloader();
