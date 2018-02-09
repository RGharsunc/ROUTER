var mongoose = require("mongoose");
var db = mongoose.connect('mongodb://localhost:27017/test', {});
var errors = require('../configs/errorObjects.js')
    // var configs = require('../configs/config.js')
var cripting = require('../crypting/cryptHash.js')
var Schema = mongoose.Schema;


/**-------- SChema for creating new device in db (Mongo db)-------------------*/
var devSchema = new Schema({
    name: String,
    ip: String,
    status: Boolean
})

/**-------- SChema for creating user in db (Mongo db)-------------------*/
var userSchema = new Schema({
    name: String,
    password: String,
    device: [devSchema]
});

User = mongoose.model("User", userSchema) /**-------model of user--------- */
Device = mongoose.model("Device", devSchema) /**-------model of device, it will be member of user model----------*/




/**---------------thise method will check if there are any device from thise 
 * ---------------ip address or any of devices has inserted name----------------- */
var registerDevice = function(devName, devIp, userName, cb) {
    var device12 = new Device({
        name: devName,
        ip: devIp,
        status: true
    })
    User.findOne({ name: userName }, function(err, data) {
        if (err || !data) {
            cb(errors.errUsername);
        } else if (chekIfDevExists(device12, data.device)) {
            cb(errors.devExistsErr);
            console.log('dev exists')
        } else {
            data.device.push(device12);
            data.save(function(err, result) {
                if (err || !result) {
                    cb(errors.dbError)
                } else {
                    cb(null, errors.backData)
                }
            });
            // cb(null, errors.backData)
        }
    });

}

var chekIfDevExists = function(device, deviceList) {
    for (var i in deviceList) {
        if (deviceList[i].name != null && deviceList[i].name == device.name || deviceList[i].ip == device.ip) {
            // console.log('devname' + deviceList[i].name)
            // console.log('device.name' + device.name)
            // console.log('devIP' + device.ip)
            // console.log("every device" + i)


            return true;
        }
    }
    return false;

}

/**-------------will check if there are no any user registered 
 * --------------and register user, only one--------------- */
var registerUser = function(userData, cb) {
    var user = new User({
        name: userData.userName,
    });
    User.findOne({}, function(err, data) {
        if (err) {
            cb(errors.dbError)
        } else if (data == null) {
            cripting.hashing(userData.password, function(err, hash) {
                if (err || hash == null) {
                    cb(errors.errHash)
                } else {
                    user.password = hash;
                    user.save();
                }
            });
        } else {

            cb({ message: errors.errUserExists.message + data.name })
        }

    })


};

/**----------will get the only user and if password is correct, replase it with new password ----------------- */

var changePassword = function(userName, oldPass, newPass, cb) {

    // console.log(userName)
    User.findOne({ name: userName }, function(err, data) {
        cripting.comparePassword(oldPass, data.password, function(err, result) {
            if (err) {
                cb(errors.errHash)
            } else if (result == true) {
                cripting.hashing(newPass, function(err, hashedNewPassword) {
                    if (err || !hashedNewPassword) {
                        cb(errors.errHash)
                    } else {
                        data.password = hashedNewPassword;
                        data.save();
                    }
                })

            } else {
                cb(errors.errPassword)
            }
        })
    })
};


/**-------------will change device status (true active, false desconnected)----------------- */
var changeDeviceStatus = function(ip, status, cb) {
    console.log("starts changing status")

    User.findOne({}, function(err, user) {
        if (err || !user) {
            console.log("error: " + err)
            console.log("user: " + user)
            cb(errors.errUsername)
        } else {
            for (var i = 0; i < user.device.length; ++i) {
                var dev = user.device[i];
                if (dev.ip == ip) {
                    dev.status = status;
                    user.save(function() {
                        cb(null, errors.backData);
                    });
                } else {};
            };
        }
    })
}

/**-------------will chack if user has device with inserted name and delete----------------- */
var
    deleteDevice = function(devName, userName, cb) {
        User.findOne({ name: userName }, function(err, data) {
            if (err || !data) {
                cb(errors.errLogin)
            } else {
                var user = data;
                var devs = Object.assign([], user.device);
                for (i = 0; i < devs.length; ++i) {
                    if (devs[i].name == devName) {
                        devs.splice(i, 1);
                    }
                }
                if (devs.toString() == user.device.toString()) {
                    cb(errors.devNotExist)
                } else {
                    user.device = devs;
                    user.save(function(err, result) {
                        if (err || !result) {
                            cb(err)
                        } else {
                            cb(null, errors.backData)
                        }
                    });
                }
            }
        });
    };

/**-------------will chack if user has device with inserted name and change it to new name----------------- */
var changeDeviceName = function(userName, data, cb) {
    User.findOne({ name: userName }, function(err, user) {
        if (err || !user) {
            cb(errors.errLogin)
            return -1;
        };
        cripting.comparePassword(data.password, user.password, function(err, result) {
            if (err) {
                cb(errors.errHash)
            } else if (result == true) {
                for (var i = 0; i < user.device.length; ++i) {
                    var dev = user.device[i];
                    if (dev.name == data.devOldName) {
                        dev.name = data.devNewName;
                        break;
                    } else {
                        console.log("there are no diveces with name: " + data.devOldName)
                    };
                };
                user.save(function(err, data) {
                    console.log('saving')
                    if (err || !data) {
                        cb(err);
                    } else {
                        cb(null, errors.dbError)
                    }
                });
            };
        })
    })
};
/**----------Cheking if user with this uderName exists--------------- */
var checkUserData = function(userName) {
    return User.findOne({ name: userName }).exec();
};

/**-------Geting device list from Mongo DB----------- */
var getDeviceList = function(userName) {
    return User.findOne({}).exec();
};



module.exports = {

    /**-----------to register only cuurent device (if stil not)-------------*/
    checkUserData: checkUserData,

    /**-----------to register only cuurent device (if stil not)-------------*/
    registerUser: registerUser,

    /**-----------to register only cuurent device (if stil not)-------------*/
    changePassword: changePassword,

    /**-----------to register only cuurent device (if stil not)-------------*/
    registerDevice: registerDevice,

    /**-----------to register only cuurent device (if stil not)-------------*/
    deleteDevice: deleteDevice,

    /**-----------to register only cuurent device (if stil not)-------------*/
    changeDeviceName: changeDeviceName,

    /**-----------to register only cuurent device (if stil not)-------------*/
    getDeviceList: getDeviceList,

    /**-----------to change device status----------- */
    changeDeviceStatus: changeDeviceStatus
};