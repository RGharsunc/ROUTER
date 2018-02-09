var socket = io();
var isLogin = false;
var userName = null;
var password = null;
var currentDeviceName = null;
var alphaNumeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;

var p2pModule = angular.module('p2pModule', ['ngRoute']);

socket.on('serverError', function(data){
  if(typeof(data) != 'string')
    $.notify(data.message, {type:"danger"});
  else
  $.notify(data, {type:"danger"});
});
socket.on('success', function(data){
  if(typeof(data) != 'string')
    if(data.message == 200)
      $.notify('success', {type:"success"});
    else
      $.notify(data.message, {type:"success"});
  else
    if(data == 200)
      $.notify('success', {type:"success"});
    else  
      $.notify(data, {type:"success"}); 
});