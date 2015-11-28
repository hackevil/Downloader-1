"use strict"

var fs = require('fs'),
  request = require('request'),
  progress = require('request-progress'),
  downloadDir = "downloads/",
  Nedb = require('nedb'),
  files = new Nedb({
    filename: 'db/data.db',
    autoload: true
  });

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

class Downloader {
  constructor() {
    this.fileList = new Array();
    this.count = 0;
  }

  download(url) {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    console.log("[Downloading", filename, "]");
    let db = this.fileDb;
    let _self = this;
    // Note that the options argument is optional 
    progress(request(url), {
        throttle: 2000, // Throttle the progress event to 2000ms, defaults to 1000ms 
        delay: 1000 // Only start to emit after 1000ms delay, defaults to 0ms 
      })
      .on('progress', function(state) {
        files.update({
          filename: filename
        }, {
          filename: filename,
          url: downloadDir + filename,
          received: state.received,
          // The properties {precent, total} can be null if response does not contain the content-length header 
          total: state.total,
          percent: state.percent,
          done: false
        }, {
          upsert: true
        }, function(err, numReplaced, upsert) {
          if (err) {
            console.log("Failed upsert during progress:", err);
          }
        });
      })
      .on('error', function(err) {
        console.log("[Error on download]\n", err);
        if (_self.count < 3) {
          console.log("Retrying");
          _self.download(url);
          _self.count++;
        } else {
          console.log("[Failed to download after 3 attempts]");
        }
      })
      .pipe(fs.createWriteStream(downloadDir + filename))
      .on('error', function(err) {
        console.log("[Error on pipe]\n", err);
      })
      .on('close', function(err) {
        files.find({
          filename: filename
        }, function(err, docs) {
          // A small file wont even see 'progress'
          if (err) {
            console.log("[Error on Close: Failed to find", filename, "]\n", err);
          }
          var total = 10240,
            percent = 100;
          if (docs && docs.length > 0) {
            total = docs[0].total;
            percent = docs[0].percent;
          }
          console.log(percent);
          files.update({
            filename: filename
          }, {
            filename: filename,
            url: downloadDir + filename,
            received: total,
            total: total,
            percent: percent,
            done: true
          }, {
            upsert: true
          }, function(err, numReplaced, upsert) {
            if (err) {
              console.log("[Error: Failed upsert during close]\n", err);
            }
          });
          console.log("[Finished:", filename, "]");
        });
      })

    return {
      filename: filename,
      url: downloadDir + filename,
      received: 0,
      total: 0,
      percent: 0,
      done: false
    };
  }

  get files() {
    let _self = this;
    // Now we can query it the usual way
    files.find({}, function(err, docs) {
      if (err) {
        console.log("[Error retrieving file list]\n", err);
      }
      _self.fileList.splice(0, _self.fileList.length);
      for (var value of docs) {
        _self.fileList.push(value);
      }
    });
    return this.fileList;
  }
}

module.exports = new Downloader();
