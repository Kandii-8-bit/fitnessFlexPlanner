var MODEL = (function () {
  var _loadpage = function (pagename, callback) {
    $.get(`pages/${pagename}.html`, function (data) {
      $("#app").html(data);

      if (callback) {
        callback();
      }
    });
  };

  return {
      loadpage: _loadpage
  }
})();
