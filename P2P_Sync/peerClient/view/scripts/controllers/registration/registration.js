p2pModule.controller('registrationController', function ($scope, socketServise) {
  $scope.errorMessage = "";
  $scope.userName = "";
  $scope.password = "";
  $scope.confPassword = "";
  //$scope.deviceName = "";

  $scope.submit = function () {
    $scope.userName = ($scope.userName.length > 0 &&
        $scope.userName.length < 51 &&
        $scope.userName.match(alphaNumeric)) ?
      $scope.userName : null;

    $scope.password = ($scope.password.length > 3 &&
        $scope.password.match(alphaNumeric)) ?
      $scope.password : null;

    $scope.confPassword = ($scope.confPassword === $scope.password) ?
      $scope.confPassword : null;

    // $scope.deviceName = ($scope.deviceName.length > 10 &&
    //     $scope.deviceName.match(alphaNumeric)) ?
    //   $scope.deviceName : null;

    if ($scope.userName == null || $scope.password == null ||
      $scope.confPassword == null /*|| $scope.deviceName == null*/) {

      $scope.userName = "";
      $scope.password = "";
      $scope.confPassword = "";
      //$scope.deviceName = "";
      $scope.errorMessage = errMsgs.errValidation + '\n' + errMsgs.errUserName +  '\n' + errMsgs.errPassword;
      return;
    }
    $scope.errorMessage = "";
    socket.emit('registration', {
      userName: $scope.userName,
      password: $scope.password,
      confPassword: $scope.confPassword
      //deviceName: $scope.deviceName
    });
    socketServise.onSuccessRegistration(function(data){
      location.href = "http://localhost:3000/#!/login";
    });
  }
});