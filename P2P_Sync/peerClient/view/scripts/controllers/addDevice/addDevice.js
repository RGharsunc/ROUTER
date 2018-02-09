p2pModule.controller('addDevice', function ($scope, socketServise) {
  socket.emit('isLoggedIn', null);

  socketServise.isLoggedIn(function (data) {
    $scope.errorMessage = "";
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
        socket.emit('addDevice', {
          deviceName: $scope.deviceName
        });
        currentDeviceName = $scope.deviceName;
        location.href = "http://localhost:3000/#!/home";
      }
    }else{
      location.href = "http://localhost:3000/#!/login";
    }
  })
});