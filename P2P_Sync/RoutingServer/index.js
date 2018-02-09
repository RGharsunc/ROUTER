// 'use strict';

var config = require('./configs/config.js')
var sock = require('./sockets/socketOn')
var connect = require('./connect.js')


/**--------------to start the app-------------*/
connect.appGet();

/**--------------to handle emitted from nodes sockets------------------- */
sock.connection();

/**--------------listening port for http server---------------- */
connect.listenToPort();