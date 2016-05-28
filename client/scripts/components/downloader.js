'use strict';

const Vue = require('vue');
const downloads = require('./downloads');
const utils = require('../utils');

module.exports = new Vue({
  parent: downloads,

  el: '#downloader',

  data: {
    downloadUrl: undefined,
  },

  methods: {
    download() {
      const url = this.downloadUrl;
      if (url && url.length > 0) {
        const trimmedUrl = url.trim();
        utils.request('POST', '/api/v1/downloads', {
          url: trimmedUrl,
        }, (req) => {
          if (req.status === 200) {
            this.$dispatch('downloadUrl', req.responseText);
          }
        });
      }
    },
  },
});
