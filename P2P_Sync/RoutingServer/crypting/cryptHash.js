var bcrypt = require('bcrypt');
var errors = require('../configs/errorObjects.js');
var conf = require('../configs/config.js');
var saltCount = 10;


/**--------------hashing password and gives it to callBack function----------------------- */
var hashing = function(password, cb) {
    bcrypt.hash(password, saltCount, cb);
};

/**----------------comparing new password with hash of password from DB ----------------- */
var comparePassword = function(encomingPass, realPassHash, cb) {
    console.log('before comparing')
    bcrypt.compare(encomingPass, realPassHash, function(err, res) {
        if (err) {
            console.log('error emitted in comparing: ')
            cb(err)
        } else {
            console.log('result of comparing: ' + res)
            cb(null, res)
        }
    })
}


module.exports = {
    hashing: hashing,
    comparePassword: comparePassword
}