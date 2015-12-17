var path   = require('path')
  , moment = require('moment');

module.exports = function(User) {

  User.uploadAvatar = function(req, res, cb) {

    var options = {
      container: 'avatar',
      allowedContentTypes: ['image/jpeg', 'image/png'],
      getFilename: function(file, req, res) {
        var ext  = path.extname(file.name);
        var name = moment().valueOf();
        return name + ext;
      }
    };

    User.app.models.LocalStorage.upload(req, res, options, function(err, result) {
      if (err) {
        return cb(err);
      }

      var file = result.files.file[0];

      var fileObject = {
        name: file.name,
        type: file.type,
        url:  file.name
      };

      return cb(null, fileObject);
    });
  };

  User.remoteMethod(
    'uploadAvatar',
    {
      description: 'Uploads one avatar for the specified user. The request body must use multipart/form-data which the file input type for HTML uses.',
      accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      returns: {
        arg: 'fileObject', type: 'object', root: true
      },
      http: { path: '/:id/avatars', verb: 'post' }
    }
  );

};
