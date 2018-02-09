p2pModule.config(function($routeProvider) {

  $routeProvider.when('/', {
    redirectTo : function(){
      return '/home';
    }
  }).when("/login", {
    templateUrl : "/view/views/login/login.html",
    controller : "loginController"
  }).when("/registration", {
    templateUrl : "/view/views/registration/registration.html",
    controller : "registrationController"
  }).when("/home", {
    templateUrl : "/view/views/home/home.html",
    controller : "homeController"
  }).when("/changePassword", {
    templateUrl : "/view/views/changePassword/changePassword.html",
    controller : "changePassword"
  }).when("/addDevice", {
    templateUrl : "/view/views/addDevice/addDevice.html",
    controller : "addDevice"
  }).when("/changeDeviceName", {
    templateUrl : "view/views/changeDeviceName/changeDeviceName.html",
    controller : "changeDeviceName"
  }).when("/deleteDevice", {
    templateUrl : "view/views/deleteDevice/deleteDevice.html",
    controller : "deleteDevice"
  });

});