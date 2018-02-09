var requirements = require('./server.js')
var config = require('./configs/config.js');



/**--------------app starting from thise function, by handling express's get request '/'-------------*/
var appGet = function() {
    requirements.app.get('/', function(req, res) {
        return res.sendFile(requirements.path.join('veiw', 'loginRegistr.html'), { root: __dirname });
    });
};


var listenToPort = function() {
    requirements.http.listen(config.PORT, function() {
        console.log('litening on port: ' + config.PORT);
    });
};

module.exports = {
    appGet: appGet,
    listenToPort: listenToPort
};