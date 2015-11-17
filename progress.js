"use strict"

var fs = require('fs'),
  request = require('request'),
  progress = require('request-progress'),
  downloadDir = "./downloads";

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

class DownloadFile {
  constructor(filename, total) {
    this.filename = filename;
    this.total = total;
    this.received = 0;
    this.percent = 0;
  }
}

class Downloader {

  constructor() {
    this.fileDb = new Map();
  }

  download(url) {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    console.log("Downloading", filename);
    let db = this.fileDb;
    // Note that the options argument is optional 
    progress(request(url), {
        throttle: 2000, // Throttle the progress event to 2000ms, defaults to 1000ms 
        delay: 1000 // Only start to emit after 1000ms delay, defaults to 0ms 
      })
      .on('progress', function(state) {
        // The properties {precent, total} can be null if response does not contain the content-length header 
        var download = db.get(filename);
        if (download == undefined) {
          download = new DownloadFile(url, state.total);
          db.set(filename, download);
        }
        download.received = state.received;
        download.percent = state.percent;
      })
      .on('error', function(err) {
        console.log(err);
      })
      .pipe(fs.createWriteStream(downloadDir + "/" + filename))
      .on('error', function(err) {
        console.log(err);
      })
      .on('close', function(err) {
        console.log(err);
      })
  }

  get files() {
    return this.fileDb.values();
  }
}

module.exports = new Downloader();
