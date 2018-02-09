var requirements = require('../server.js')
var config = require('../configs/config.js')
var service = require('../services/service.js')
var emitters = require('./socketEmit.js')
var errors = require('../configs/errorObjects.js')




/**--------------will return ip address of socket-------------------- */
var getIp = function(address) {
    if (address == '::1') {
        return '127.0.0.1';
    } else {
        var index = address.lastIndexOf(':');
        return address.substring(index + 1)
    }
}


/**--------------checking if socket is from current room-------------- */
var isInRoom = function(socket, roomName) {
    for (var i in requirements.server.sockets.adapter.rooms[roomName]) {
        if (socket.id == i) {
            return true;
        }
    }
    return false;
}


/**-------------------cheking if there are some user logged in?--------------- */
var checkUser = function() {
    requirements.service.checkUser();
}



/**--------------------------------------------socket handlers-------------------------------------- */



var disconnect = function(socket) {
    socket.on('disconnect', function() {
        var ip = getIp(socket.handshake.address)

        service.changeDeviceStatus(ip, false, function(err, backData) {
            console.log('status changed socket')
        });
        console.log('user disconnected : ' + getIp(socket.handshake.address));
    });
};






var getDevList = function(socket) { //geting async function's return value example
    socket.on("getDeviceList", function() {
        if (isInRoom(socket, config.socketRoom)) {

            service.getDeviceList(function(error, devices) {
                if (error) {
                    emitters.errorEmitter(socket, error);
                } else {
                    emitters.deviceListEmitter(socket, devices);
                };
            });
        } else {
            service.errCallBack(socket, errors.errLogin, emitters.errorEmitter);
        }
    })

}



var devListBroadcast = function(socket) {
    service.getDeviceList(function(error, devices) {
        if (error) {
            emitters.errorEmitter(socket, error)
        } else {
            emitters.deviceListServerEmitter(socket, devices)
        }
    })
}


var login = function(socket) {
    socket.on('login', function(UP) {
        service.login(UP, function(err, backData) {
            if (err || !backData) {
                service.errCallBack(socket, err, emitters.errorEmitter)

            } else {
                service.sccCallBack(socket, errors.backData, emitters.sccLoginEmiter)
                var ip = getIp(socket.handshake.address)
                socket.join(config.socketRoom, function(err) {});
            }
        });
    });
}





var registration = function(socket) {
    socket.on('registration', function(userData) {
        userData.ip = getIp(socket.handshake.address);
        service.registration(userData, function(err, backData) {
            if (err || !backData) {
                emitters.errorEmitter(socket, err)
            } else {
                emitters.sccRegister(socket, backData)
            }
        });
    });
}

var changePassword = function(socket) {

    socket.on('changePassword', function(UP) {
        if (isInRoom(socket, config.socketRoom)) {
            service.cahngePassword(UP, function(err, backData) {
                if (err) {
                    emitters.errorEmitter(socket, err)
                } else {
                    emitters.success(socket, backData)
                }
            });
        } else {
            service.errCallBack(socket, errors.errLogin, emitters.errorEmitter);
        }
    });

}

var addDevice = function(socket) {
    socket.on('addDevice', function(deviceData) {
        if (isInRoom(socket, config.socketRoom)) {
            deviceData.ip = getIp(socket.handshake.address);
            service.addDevice(deviceData, function(err, backData) {
                if (err || !backData) {
                    emitters.errorEmitter(socket, err)
                } else {
                    service.getDeviceList(function(error, devices) {
                        console.log(devices + " from socketOn.addDevice111111111111")
                        if (error) {
                            emitters.errorEmitter(socket, error);
                        } else {
                            console.log(devices + " from socketOn.addDevice222222222222")

                            emitters.deviceListServerEmitter(socket, devices);
                        };
                    });
                    emitters.success(socket, backData)
                }
            });
        } else {
            service.errCallBack(socket, errors.errLogin, emitters.errorEmitter);
        }
    });

}




var deleteDevice = function(socket) {
    socket.on('deleteDevice', function(data) {
        if (isInRoom(socket, config.socketRoom)) {
            service.deleteDevice(data, function(err, backData) {
                if (err || !backData) {
                    emitters.errorEmitter(socket, err)
                } else {
                    service.getDeviceList(function(error, devices) {
                        if (error) {
                            emitters.errorEmitter(socket, error);
                        } else {
                            emitters.deviceListServerEmitter(socket, devices);
                        };
                    });
                    emitters.success(socket, backData)
                }
            });
        } else {
            service.errCallBack(socket, errors.errLogin, emitters.errorEmitter);
        }
    });
}

var changeDeviceName = function(socket) {
    socket.on('changeDeviceName', function(data) {
        if (isInRoom(socket, config.socketRoom)) {

            service.changeDeviceName(data, function(err, backData) {
                if (err || !backData) {
                    emitters.errorEmitter(socket, err)
                } else {
                    service.getDeviceList(function(error, devices) {
                        if (error) {
                            emitters.errorEmitter(socket, errors.dbError);
                        } else {
                            emitters.deviceListServerEmitter(socket, devices);
                        };
                    });
                }
            });
        } else {
            service.errCallBack(socket, errors.errLogin, emitters.errorEmitter);
        }


    });
}



var disconnect = function(socket) {
    socket.on('disconnect', function() {
        var ip = getIp(socket.handshake.address)

        service.changeDeviceStatus(ip, false, function(err, backData) {
            if (err || !backData) {
                emitters.errorEmitter(socket, errors.dbError);
            } else {
                devListBroadcast(socket);
            }
        });
        socket.leave(config.socketRoom);
    });
};
pleaseLogInEmitter = function() {}

var logout = function(socket) {
    socket.on('logout', function() {
        socket.leave(config.socketRoom)
    })
};

var changeDevStatus = function(socket, status) {
    var ip = getIp(socket.handshake.address);
    service.changeDeviceStatus(ip, status, function(err, backData) {
        if (err || backData == null) {} else {
            devListBroadcast(socket.adapter);
        }
    })
};





/** --------------------Should connect client with server ----------------------**/
var connection = function() {
    requirements.server.on('connection', function(socket) {
        changeDevStatus(socket, true);

        /**---------------out of socketRoom logic--------------*/
        registration(socket);
        login(socket);
        disconnect(socket);

        /**------------in room socketRoom logic---------------*/
        changePassword(socket);
        addDevice(socket);
        getDevList(socket);
        deleteDevice(socket);
        changeDeviceName(socket);
        logout(socket);
    });
}

module.exports = {
    connection: connection
};