p2pModule.factory('socketServise', function () {
  return {
    getFilesNames: function (cb) {
      socket.emit('getFilesNames', null);

      socket.on('filesNames', function (files) {
        cb(files);
      })
    },
    getDevices: function (cb) {
      socket.emit('getDevices', null);

      socket.on('devicesList', function (files) {
        cb(files);
      })
    },
    openWorkingDirectory: function () {
      socket.emit('openWorkingDirectory', null);
    },
    getServerErrors: function (cb) {
      socket.on('error', function (data) {
        cb(data);
      })
    },
    onLoginAnswer: function (cb) {
      socket.on('successLogin', function (data) {
        cb(data);
      })
    },
    onSuccessRegistration: function (cb) {
      socket.on('successRegistration', function (data){
        cb(data);
      })
    },
    onDeleteDevice: function(cb){
      socket.on('success', function(data){
        cb(data);
      });
    },
    onSyncSuccess: function(cb){
      socket.on('SendSyncSuccessToBrowser', function(data) {
        cb(data);
      })
    }, 
    isLoggedIn: function(cb){
      socket.on('isLoggedIn', function(data){
        cb(data);
      });
    }

  }
});