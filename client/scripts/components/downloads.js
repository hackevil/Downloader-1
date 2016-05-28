'use strict';

const Vue = require('vue');
const utils = require('../utils');
const debug = (value) => console.log(value);

module.exports = new Vue({
  el: '#files',

  data: {
    files: [],
  },

  created() {
    this.fetchData();
  },

  filters: {
    formatNumber(number) {
      return (+number / 1024 / 1024).toFixed(2);
    },
  },

  // the `events` option simply calls `$on` for you
  // when the instance is created
  events: {
    downloadUrl(file) {
      // `this` in event callbacks are automatically bound
      // to the instance that registered it
      this.files.push(JSON.parse(file));
    },
  },

  methods: {
    fetchData() {
      setInterval(() => {
        utils.request('GET', '/api/v1/downloads', undefined, (req) => {
          this.files = JSON.parse(req.responseText);
        });
      }, 1000);
    },
    deleteFile(event) {
      if (event.target.dataset.id) {
        utils.request('DELETE', `/api/v1/downloads/${event.target.dataset.id}`,
          undefined, () => debug('Remove specific.'));
      }
    },
    clear() {
      utils.request('DELETE', '/api/v1/downloads', undefined, () =>
        debug('Clear remove specific.'));
    },
  },
});
