'use strict';

const Vue = require('vue');
const downloads = require('./downloads');
const request = require('axios');

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
        request
          .post('/api/v1/downloads', {
            data: {
              url: url.trim(),
            },
          })
          .then((res) => this.$dispatch('downloadUrl', res.data));
      }
    },
  },
});
