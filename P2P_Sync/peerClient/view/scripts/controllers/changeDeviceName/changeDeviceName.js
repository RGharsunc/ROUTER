p2pModule.controller('changeDeviceName', function ($scope, socketServise) {
  $scope.errorMessage = "";
  socket.emit('isLoggedIn', null);

  socketServise.isLoggedIn(function (data) {
    isLogin = data;

    if (isLogin) {

      $scope.devOldName = "";
      $scope.devNewName = "";
      $scope.password = "";
      $scope.errorMessage = "";

      $scope.submit = function () {
        $scope.devOldName = ($scope.devOldName.length > 0 &&
            $scope.devOldName.length < 21 &&
            $scope.devOldName.match(alphaNumeric)) ?
          $scope.devOldName : null;

        $scope.devNewName = ($scope.devNewName.length > 0 &&
            $scope.devNewName.length < 21 &&
            $scope.devNewName.match(alphaNumeric)) ?
          $scope.devNewName : null;

        $scope.password = ($scope.password.length > 3 &&
            $scope.password.match(alphaNumeric)) ?
          $scope.password : null;

        if ($scope.devOldName == null ||
          $scope.devNewName == null ||
          $scope.password == null) {
          $scope.devNewName = "";
          $scope.password = "";
          $scope.errorMessage = errMsgs.errValidation + '\n' + errMsgs.errDeviceName + '\n' +errMsgs.errPassword;
          return;
        }
        $scope.errorMessage = "";
        socket.emit('changeDeviceName', {
          devOldName: $scope.devOldName,
          devNewName: $scope.devNewName,
          password: $scope.password
        });
        location.href = "http://localhost:3000/#!/home";
      }
    }
    else{
      location.href = "http://localhost:3000/#!/login";
    }
  })
})