var repo = require('../services/repo.js')
var valid = require('./validation.js')
var errors = require('../configs/errorObjects.js')
var cripting = require('../crypting/cryptHash.js')

var USERNAME = "";


var callBack = function(socket, error, errEmitter, data, sccEmiter) {
    if (error || !data) {
        errEmitter(socket, error)
    } else {
        console.log(data)
        sccEmiter(socket, data)
    }
}

var sccCallBack = function(socket, data, sccEmitter) {
    sccEmitter(socket, data)
};

var errCallBack = function(socket, data, errEmitter) {
    errEmitter(socket, data)
}

/**-------this method is part of login logic (cheking if USERNAME has not null value)--------- */
var checkUser = function() {
    if (USERNAME == "" || USERNAME == null || typeof USERNAME === undefined) {
        console.log("please log in")
        return false;
    } else {
        return true;
    }
};

/**-----------changing dev status in Mongo DB------------- */
var changeDeviceStatus = function(ip, status, cb) {
    console.log('dev status changing service')
    repo.changeDeviceStatus(ip, status, cb)
}

/**------------adding user in Mongo DB after validation of data---------------- */
var registration = function(userData, cb) {
    var password = userData.password;
    var confPassword = userData.confPassword;
    if (password != confPassword) {
        cb(errors.noMutchPass);
        return;
    }
    if (valid.loginValidation(userData.userName, userData.password)) {
        repo.registerUser(userData, cb);
        cb(null, errors.backData)
    } else {
        cb(errors.validationFailed);
    }
};

/**-------------will call validation and will chek if user with 
 * inserted username is exists in Mongo DB---------------- */
var login = function(UP, cb) {
    var userName = UP.userName;
    var password = UP.password;
    if (valid.loginValidation(userName, password)) {
        repo.checkUserData(userName, password)
            .then(function(user) {
                if (user == null) {
                    cb(errors.errUsername);
                } else {
                    cripting.comparePassword(password, user.password, function(err, result) {
                        if (err) {
                            cb(errors.dbError);
                        } else if (result == true) {
                            USERNAME = userName;
                            cb(null, errors.backData)
                        } else {
                            cb(errors.errPassword)
                        }
                    })
                }
            });
    } else {
        cb(errors.errUP)
    };
};

/**------------will check if password inserted correct and change it to new one------------------ */
var cahngePassword = function(UP, cb) {
    if (!USERNAME) {
        cb(errors.errLogin);
        return;
    }
    var pass = UP.oldPassword;
    var newPass = UP.newPassword;
    var confPass = UP.confirmPassword;
    if (newPass != confPass) {
        cb(errors.noMutchPass);
        return;
    }
    if (valid.chPassValidation(pass, newPass, confPass, cb)) {
        repo.changePassword(USERNAME, pass, newPass, cb);
        cb(null, errors.backData)
    } else {
        cb(errors.validationFailed)
    }

};

/**--------------will add new device into DB if inserted 
 * valid dev name and if there are no one already added------------------- */
var addDevice = function(data, cb) {
    var devName = data.deviceName;
    var devIp = data.ip;
    if (valid.deviceNameValidation(devName, cb)) {
        repo.registerDevice(devName, devIp, USERNAME, cb);
    }
}

/**-------------will delete device with inserted name if it exists------------ */
var deleteDevice = function(data, cb) {
    var devName = data.deviceName;
    repo.deleteDevice(devName, USERNAME, cb);
};


/**--------------returns device list from DB------------------ */
var getDeviceList = function(cb) {
    var devs = [];
    repo.getDeviceList(USERNAME)
        .then(function(user) {
            if (user == null) {
                cb('can not find user');
            } else {
                devs = user.device;
                cb(null, user.device);

            }
        });
    return devs;

};


/**----------------changing device name ----------------------- */
var changeDeviceName = function(data, cb) {
    var userName = USERNAME;
    repo.changeDeviceName(userName, data, cb);
}

module.exports = {


    /**-----------checking if there are any user loged in-------------*/
    checkUser: checkUser,

    /**-----------to register user, must be called with very first time when ROUTER_SERVER was runed-------------*/
    registration: registration,

    /**-----------to login olready registered user,
                  will be called every time when will be runed PEAR_CLIENT-------------*/
    login: login,

    /**-----------to change password of registered user-------------*/
    cahngePassword: cahngePassword,

    /**-----------to register only cuurent device (if stil not)-------------*/
    addDevice: addDevice,

    /**-----------to delete any device, -------------*/
    deleteDevice: deleteDevice,

    /**-----------givs back list of users devices (name, ip, status)-------------*/
    getDeviceList: getDeviceList,

    // /**-----------checking if there are any user loged in-------------*/
    // getFileList: getFileList,

    /**-----------to change name of any device from list -------------*/
    changeDeviceName: changeDeviceName,


    /**------------to change device's status-------------- */
    changeDeviceStatus: changeDeviceStatus,
    sccCallBack: sccCallBack,
    errCallBack: errCallBack,
}