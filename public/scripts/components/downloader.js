var lack = lack || {};
lack.biblio = lack.biblio || {};
lack.biblio.component = lack.biblio.component || {};

lack.biblio.component.downloader = new Vue({

  parent: lack.biblio.component.downloadList,

  el: '#downloader',

  // template: '<p>A custom component!</p>',

  methods: {
    download: function() {
      var url = this.downloadUrl;
      var self = this;
      if (url && url.length > 0) {
        url = url.trim();
        lack.biblio.utils.request("POST", "/api/v1/downloads", {
          url: url
        }, function(req) {
          if (req.status === 200) {
            self.$dispatch('url-download', req.responseText);
          }
        });
      }
    }
  }
});
