var valid = require('validator');
// var errors = require('../configs/errorObjects.js')
module.exports = {


    /**---------------UserName and password validation-------------------- */
    loginValidation: function(userName, password) {
        if (!valid.isAlphanumeric(userName)) {
            console.log(userName + ": is not valid username");
            return false;
        }

        if (userName.length == 0 || userName.length > 50) {
            console.log("username length is not coorrect" + username.length);
            return false;
        }

        if (!valid.isAlphanumeric(password) || password.length < 4) {
            console.log("password is not correct :" + password.length + " " + password)
            return false;
        };
        return true;
    },

    /**-----------------validation of new password-------------------- */
    chPassValidation: function(pass, newPass, confPass, cb) {

        if (!valid.isAlphanumeric(pass) || pass.length < 4) {
            cb(errors.notCorrUP)
            console.log("password is not correct :" + pass.length + " " + pass)
            return false;
        };
        if (!newPass === confPass) {
            cb(errors.noMutchPass)
            console.log("new password: " + newPass + " and password for confirm: " + confPass + " are not the same")
            return false;
        }
        return true;

    },

    /**---------------validation of device name---------------------- */
    deviceNameValidation: function(devName, cb) {
        if (!valid.isAlphanumeric(devName) || devName.length > 10) {
            cb(errors.errDevNameValid);
            console.log(errors.errDevNameValid);
            return false;
        }
        return true;
    }
}