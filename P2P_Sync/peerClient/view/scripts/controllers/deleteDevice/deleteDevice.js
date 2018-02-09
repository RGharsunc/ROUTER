p2pModule.controller('deleteDevice', function ($scope, socketServise) {
  $scope.errorMessage = "";
  socket.emit('isLoggedIn', null);

  socketServise.isLoggedIn(function (data) {
    isLogin = data;

    if (isLogin) {
      $scope.deviceName = "";

      $scope.submit = function () {
        $scope.deviceName = ($scope.deviceName.length > 0 &&
            $scope.deviceName.length < 21 &&
            $scope.deviceName.match(alphaNumeric)) ?
          $scope.deviceName : null;

        if ($scope.deviceName == null) {
          $scope.errorMessage = errMsgs.errValidation + '\n' + errMsgs.errDeviceName;
          return;
        }
        $scope.errorMessage = "";
        socket.emit('deleteDevice', {
          deviceName: $scope.deviceName
        });
        if ($scope.deviceName == currentDeviceName) {
          currentDeviceName = null;
        }
        socketServise.onDeleteDevice(function (data) {
          location.href = "http://localhost:3000/#!/home";
        });
      }
    }
    else{
      location.href = "http://localhost:3000/#!/login";
    }
  })
});