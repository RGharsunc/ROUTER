p2pModule.controller('loginController', function ($scope, socketServise) {
  $scope.errorMessage = "";
  $scope.userName = "";
  $scope.password = "";
  if(isLogin){
    location.href = "http://localhost:3000/#!/home";
  }

  $scope.submit = function () {
    $scope.userName = ($scope.userName.length > 0 &&
                       $scope.userName.length < 51 &&
                       $scope.userName.match(alphaNumeric)) ?
                    $scope.userName : null;

    $scope.password = ($scope.password.length > 3 &&
                       $scope.password.match(alphaNumeric)) ?
                    $scope.password : null;

    if ($scope.userName == null || $scope.password == null) {
      $scope.userName = "";
      $scope.password = "";
      $scope.errorMessage = errMsgs.errValidation + '\n' + errMsgs.errUserName + '\n' + errMsgs.errPassword;

      isLogin =false;
      return;
    }
    $scope.errorMessage = "";

    socket.emit('login', {
      userName: $scope.userName,
      password: $scope.password
    });
    socketServise.onLoginAnswer(function(data){
      //console.log('onLoginAnswer');
      isLogin = true;
      location.href = "http://localhost:3000/#!/home";
    })
  }
});