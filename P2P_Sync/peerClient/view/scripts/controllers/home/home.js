p2pModule.controller('homeController', function ($scope, socketServise) {
  $scope.errorMessage = "";
  socket.emit('isLoggedIn', null);

  socketServise.isLoggedIn(function(data){
    isLogin=data;

    if(isLogin){
      $scope.openWorkingDirectory = socketServise.openWorkingDirectory;
      $scope.filesNames = null;
      $scope.devices = null;
      $scope.currentDeviceName = currentDeviceName;
      $scope.logout = function(){
        isLogin=false;
        socket.emit('logout', null);
        location.href = "http://localhost:3000/#!/login";
      }

      if(currentDeviceName != null){
        $('#addDevice').hide();
      }

      socketServise.getFilesNames(function(data){
        var arr = [];
        arr.push(data);
        $scope.filesNames = arr;
        $scope.$apply();
      });
      
      socketServise.getDevices(function(data){
        console.log("Get device List");
        $scope.currentDeviceName = '';
        var temp = [];
        for(var i = 0; i < data.deviceList.length; i++) {
          if(data.deviceList[i].ip !== data.deviceip) {
            temp.push(data.deviceList[i]);
          } else {
            currentDeviceName = data.deviceList[i].name;
            $scope.currentDeviceName = currentDeviceName;
          }
        }
        if(data.deviceList.length < 1)
        {
          $('#deleteDevice').hide();
          $('#changeDeviceName').hide();
        }
        if(currentDeviceName != null){
          $('#addDevice').hide();
        }
        $scope.devices = temp;
        $scope.$apply();
      });

      $scope.sync = function(ip){
        socket.emit("synchToPeer", ip);    
      }

      socketServise.onSyncSuccess(function(data){
        if(typeof(data) != 'string')
          $.notify(data.message, {type:"success"});
        else  
          $.notify(data, {type:"success"}); 
        socketServise.getFilesNames(function(data){
          var arr = [];
          arr.push(data);
          $scope.filesNames = arr;
          $scope.$apply();
        });
      });
    }
    else{
      location.href = "http://localhost:3000/#!/login";
    }
  })
});