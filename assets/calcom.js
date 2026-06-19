(function (C, A, L) {
  var push = function (api, args) {
    api.q.push(args);
  };
  var documentRef = C.document;

  C.Cal =
    C.Cal ||
    function () {
      var cal = C.Cal;
      var args = arguments;

      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        documentRef.head.appendChild(documentRef.createElement('script')).src = A;
        cal.loaded = true;
      }

      if (args[0] === L) {
        var api = function () {
          push(api, arguments);
        };
        var namespace = args[1];
        api.q = api.q || [];

        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          push(cal.ns[namespace], args);
          push(cal, ['initNamespace', namespace]);
        } else {
          push(cal, args);
        }
        return;
      }

      push(cal, args);
    };
})(window, 'https://app.cal.com/embed/embed.js', 'init');

Cal('init', 'diag30', { origin: 'https://cal.com' });
Cal.ns.diag30('ui', { hideEventTypeDetails: false, layout: 'month_view' });
