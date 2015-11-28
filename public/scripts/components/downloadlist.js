var lack = lack || {};
lack.biblio = lack.biblio || {};
lack.biblio.component = lack.biblio.component || {};

lack.biblio.component.downloadList = new Vue({

  el: '#files',

  data: {
    files: []
  },

  created: function() {
    this.fetchData();
  },

  filters: {
    formatNumber: function(number) {
      return (+number / 1024 / 1024).toFixed(2);
    }
  },

  // the `events` option simply calls `$on` for you
  // when the instance is created
  events: {
    'url-download': function(file) {
      // `this` in event callbacks are automatically bound
      // to the instance that registered it
      this.files.push(JSON.parse(file))
    }
  },

  methods: {
    fetchData: function() {
      var self = this;
      setInterval(function() {
        lack.biblio.utils.request("GET", "/api/v1/downloads", undefined, function(req) {
          self.files = JSON.parse(req.responseText);
        });
      }, 1000);
    },

    deleteFile: function() {
      lack.biblio.utils.request("DELETE", "/api/v1/downloads/1", undefined, function(req) {
        console.log("Remove specific.");
      });
    },

    clear: function() {
      lack.biblio.utils.request("DELETE", "/api/v1/downloads", undefined, function(req) {
        console.log("Clear remove specific.");
      });
    }

  }
})
