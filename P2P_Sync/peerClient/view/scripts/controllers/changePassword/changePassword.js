p2pModule.controller('changePassword', function ($scope,socketServise) {
  $scope.errorMessage = "";
  socket.emit('isLoggedIn', null);

  socketServise.isLoggedIn(function (data) {
    isLogin = data;

    if (isLogin) {
      $scope.oldPassword = "";
      $scope.newPassword = "";
      $scope.confirmPassword = "";

      $scope.submit = function () {
        $scope.oldPassword = ($scope.oldPassword.length > 3 &&
            $scope.oldPassword.match(alphaNumeric)) ?
          $scope.oldPassword : null;

        $scope.newPassword = ($scope.newPassword.length > 3 &&
            $scope.newPassword.match(alphaNumeric)) ?
          $scope.newPassword : null;

        $scope.confirmPassword = ($scope.confirmPassword === $scope.newPassword) ?
          $scope.confirmPassword : null;

        if ($scope.oldPassword == null ||
          $scope.newPassword == null ||
          $scope.confirmPassword == null) {
          $scope.newPassword = "";
          $scope.confirmPassword = "";

          $scope.errorMessage = errMsgs.errValidation + '\n' + errMsgs.errPassword + '\n' + errMsgs.errDeviceName;
          return;
        }
        $scope.errorMessage = "";
        socket.emit('changePassword', {
          newPassword: $scope.newPassword,
          oldPassword: $scope.oldPassword,
          confirmPassword: $scope.confirmPassword
        });
        location.href = "http://localhost:3000/#!/home";
      }
    }
    else{
      location.href = "http://localhost:3000/#!/login";
    }
  })
});