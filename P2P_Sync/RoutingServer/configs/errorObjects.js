module.exports = {

    /** ---------------will be sent for every socket about success result-------------------- */
    backData: {
        message: 200
    },
    /** ---------------will be used about errors during logging in-------------------- */
    errUP: {
        message: 'Username or password is not correct'
    },

    /** ---------------will be used about errors during username validation-------------------- */
    errUsername: {
        message: 'username is not correct'
    },

    /** ---------------will be used about errors during password comparing-------------------- */
    errPassword: {
        message: 'Password is not correct'
    },

    /** ---------------will be used about errors during any validation processes for data from UI-------------------- */
    noMutchPass: {
        message: 'The password and the confirmPassword are not matching'
    },
    /** ---------------will be used about errors during validation generally-------------------- */
    validationFailed: {
        message: 'Inserted data did not passed the validation, please be careful !!! '
    },

    /** ---------------will be used about errors during registration generally-------------------- */
    registrError: {
        message: 'Something goes wrong during registration, please try again'
    },

    /** ---------------will be used when user already has registered device with this ip or devName-------------------- */
    devExistsErr: {
        message: 'this device name or ip of it is already used please be careful'
    },

    /** ---------------will be used when user inserted not correct password-------------------- */
    notCorrUP: {
        message: 'oops!!! please enter correct password'
    },

    /** ---------------will be used when user there are some problems with DB connection-------------------- */
    dbError: {
        message: 'Sorry, we have some error with DataBase connection, please try again'
    },

    /** ---------------will be used when user already has registered-------------------- */
    errUserExists: {
        message: 'Sorry, you already have registered user, with username: '
    },

    /** ---------------will be used when user trys to get some data before login-------------------- */
    errLogin: {
        message: 'You are still not logged in, please log in'
    },

    /** ---------------will be used when user inserted not valid device name-------------------- */
    errDevNameValid: {
        message: 'Sorry your new device name is too long or not alphanumeric, please be careful'
    },

    /** ---------------will be used when we have some problems with hashing process-------------------- */
    errHash: {
        message: 'sory something wrong happend with hashing your password, please try agein'
    },
    devNotExist: {
        message: 'sorry but there is no device with this name.'
    },
    errSocketConnection: {
        message: 'sorry we have some problems with socket connection.'
    }

}