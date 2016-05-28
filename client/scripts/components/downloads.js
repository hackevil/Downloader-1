'use strict';

const Vue = require('vue');
const request = require('axios');
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
        request
          .get('/api/v1/downloads')
          .then((res) => {
            this.files = res.data;
          });
      }, 1000);
    },
    deleteFile(event) {
      if (event.target.dataset.id) {
        request
          .delete(`/api/v1/downloads/${event.target.dataset.id}`)
          .then(() => debug('Remove specific.'));
      }
    },
    clear() {
      request
        .delete('/api/v1/downloads')
        .then(() => debug('Remove all.'));
    },
  },
});
