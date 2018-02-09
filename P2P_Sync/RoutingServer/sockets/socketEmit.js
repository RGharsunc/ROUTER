var requirements = require('../server.js')
var config = require('../configs/config.js')


/**------------emits errors generally-------------- */
var errorEmitter = function(socket, err) {
    socket.emit(config.emitterName, err);
}

/**------------emits success generally-------------- */
var success = function(socket, backData) {
    socket.emit('success', backData);
}


/**---------------emitting device list-------------------- */
var deviceListEmitter = function(socket, devices) {
    socket.emit('getDeviceList', devices);
}

/**---------------emitting success after successful login--------------- */
var sccLoginEmiter = function(socket, data) {
    socket.emit('successLogin', data)
}

/**---------------emitting success after successful registering----------------- */
var sccRegister = function(socket, data) {
    socket.emit('successRegistration', data)
}

/**---------------emitting device list in broadcast------------------------- */
// var deviceListBroadcastEmitter = function(socket, devices) {
//     requirements.broadcast.emit('getDeviceList', devices);
// }

/**---------------emitting device list in server----------------- */
var deviceListServerEmitter = function(socket, devices) {
    console.log(devices)
    requirements.server.to(config.socketRoom).emit('getDeviceList', devices);
}

module.exports = {

    errorEmitter: errorEmitter,
    deviceListEmitter: deviceListEmitter,
    deviceListServerEmitter: deviceListServerEmitter,
    // deviceListBroadcastEmitter: deviceListBroadcastEmitter,
    sccLoginEmiter: sccLoginEmiter,
    sccRegister: sccRegister,
    success: success

}