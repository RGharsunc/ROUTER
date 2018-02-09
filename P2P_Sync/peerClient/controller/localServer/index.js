var express = require('express');
var app = express();
var http = require('http').Server(app);
var server = require('socket.io')(http);
var socketIoClient = require('socket.io-client');
var path = require('path');
var files = require('../../model/files');
var deleteController = require('../../model/deleteController');
var projectDir = path.join(__dirname, '../../');
var dl = require('delivery');
var port = 3000;
var routerPort = 4000;
var workingDirectory = path.join(__dirname, '..', '..', 'workingDirectory');
var fs = require('fs');
var makeDir = require('mkdir-recursive');
var localip = require('ip');
var routeSocket;
var routeIP = '172.17.8.115';
var client = null;
var serverSocket = null;
var isLogin = false;

app.use(express.static(projectDir));

app.get('/', function(req, res) {
    res.sendFile(path.join(projectDir, 'view', 'views', 'index.html'));
});

//When client connects to server
server.on('connection', function(socket) {

    clientConnected(socket);

    //Whenever has an error during connection
    socket.on('error', function(err) {
        connectionError(err);
    });

    //Whenever client disconnects
    socket.on('disconnect', function() {
        disconnectSocket(socket);
    });

    //Check is client log in
    socket.on('isLoggedIn', function(data) {
        socket.emit('isLoggedIn', isLogin);
    });

    //Listen 'login' emit from Browser and send it to Routing Server
    socket.on('login', function(data) {
        routeSocket.emit('login', data);
    });

    //Routing Server send success
    routeSocket.on('successLogin', function(data) {
        isLogin = true;
        socket.emit('successLogin', isLogin);
    });

    //Client want to register
    socket.on('registration', function(data) {
        routeSocket.emit('registration', data);
        console.log('registration');
    });

    //Server acsses register Client can registr
    routeSocket.on('successRegistration', function(data) {
        socket.emit('successRegistration', null);
    });

    //When error occurs in routeSErver
    routeSocket.on('error12', function(data) {
        socket.emit('serverError', data);
    });

    //When succes message come for routeserver
    routeSocket.on('success', function(data) {
        socket.emit('success', data);
    });

    //Log out
    socket.on('logout', function() {
        isLogin = false;
        routeSocket.emit('logout', null);
    });

    //Open Working directory
    socket.on('openWorkingDirectory', function() {
        if (isLogin) {
            require('child_process').exec('nautilus ' + workingDirectory, {
                windowsHide: true
            });
        }
    });

    //Take files object to Browser
    socket.on('getFilesNames', function() {
        if (isLogin) {
            var data = files.traverseFileSystem(workingDirectory, files.createObject());
            socket.emit('filesNames', data);
        }
    });

    //Take files names to Browser
    socket.on('getDevices', function() {
        if (isLogin) {
            routeSocket.emit('getDeviceList', null);
        }
    });

    //Router send devices list
    routeSocket.on('getDeviceList', function(data) {
        if (isLogin) {
            console.log(data);
            socket.emit('devicesList', {
                deviceList: data,
                deviceip: localip.address()
            });
        }
    });

    //When client tap to 'Synchronise' button to synchronise server's files with his files
    socket.on('synchToPeer', function(ip) {
        if (isLogin) {
            connectToPeer(ip);
        }
    });

    //Client want to delete device
    socket.on('deleteDevice', function(data) {
        if (isLogin) {
            console.log('delete dev ' + data.deviceName);
            routeSocket.emit('deleteDevice', data);
        }
    });

    //Respond delete device
    routeSocket.on('success', function(data) {
        if (isLogin) {
            socket.emit('success', data);
        }
    });

    //Chenge password
    socket.on('changePassword', function(data) {
        if (isLogin) {
            console.log(data);
            routeSocket.emit('changePassword', data);
        }
    });

    //When server listen client's emit 'syncWithPeer'. clientFilesList - files, that client send to server
    socket.on('syncWithPeer', function(clientFilesList) {
        console.log("files array sent");
        var syncFilesList = files.comparePeersFiles(clientFilesList, files.getFilesData(workingDirectory));
        sendFile(socket, syncFilesList);
        deleteController.sendDeletedObj(function(arr) {
            if (arr.length > 0) {
                socket.emit('deletedFiles', arr);
            }
        });
    });

    //Add new device
    socket.on('addDevice', function(data) {
        if (isLogin) {
            console.log('add device ' + data.deviceName);
            routeSocket.emit('addDevice', data);
        }
    });

    socket.on('changeDeviceName', function(data) {
        if (isLogin) {
            routeSocket.emit('changeDeviceName', data);
        }
    });
});

//When approved connection between client and server
function clientConnected(socket) {
    serverSocket = socket;
    var socketAddress = socket.handshake.address.split(":");
    console.log('a user connected : ' + socketAddress[socketAddress.length - 1]);
}

//When an issue during connection
function connectionError(err) {
    console.log("There was an error during connection: " + err);
}

//When client disconnects
function disconnectSocket(socket) {
    console.log('Client disconnects : ' + socket.handshake.address);
}

//When node connect to other node by ip_adress: ip
function connectToPeer(ip) {
    console.log("You want to synch with peer by ip: " + ip);
    var url = 'http://' + ip + ':' + port;
    client = socketIoClient.connect(url, {
        reconnect: true
    });
    client.on('connect', function() {
        console.log('Connected to ' + url);
        client.emit('syncWithPeer', files.getFilesData(workingDirectory)); //When client connect to server device, he fire 'syncWithPeer' emit 
    });
    client.on('error', function(err) {
        console.log("There was an error while connecting to peer: " + err);
    });
    client.on('disconnect', function() {
        console.log('user disconnected : ');
    });

    //
    client.on('SynchronisationSuccess', function() {
        serverSocket.emit('SendSyncSuccessToBrowser', 'Synchronisation is done');
    });

    client.on('deletedFiles', function(data) {
        console.log("qqqqq " + data);
        for (obj of data) {
            for (el of files.getFilesData(workingDirectory)) {
                if (el.filePath === obj.path && Date.parse(el.stats.mtime) < Date.parse(obj.time)) {
                    fs.unlinkSync(obj.path);
                    serverSocket.emit('SendSyncSuccessToBrowser', 'Synchronisation is done');
                }
            }
        }
    });
    receiveFile(client);
}

function connectToRouteServer(ip) {
    console.log("You want to synch with server by ip: " + ip);
    var url = 'http://' + ip + ':' + routerPort;
    routeSocket = socketIoClient.connect(url, {
        reconnect: true
    });
    routeSocket.on('connect', function() {
        console.log('Connected to router ' + url);
    });
    routeSocket.on('error', function(err) {
        console.log("There was an error while connecting to peer: " + err);
    });
    routeSocket.on('disconnect', function() {
        console.log('user disconnected : ');
    });
}

//This function called client to send files to server
function sendFile(socket, fileList) {
    var delivery = dl.listen(socket);
    delivery.connect();
    delivery.on('delivery.connect', function(delivery) {
        for (var i = 0; i < fileList.length; i++) {
            delivery.send({
                name: fileList[i].filePath,
                path: fileList[i].filePath, //????
            });
        }
        delivery.on('send.success', function(file) {
            console.log('File sent successfully!');
            socket.emit('SynchronisationSuccess', null);

        });
    });
}

//This function called when client receives synchronised files from server
function receiveFile(socket) {
    console.log("from receive file function");
    var delivery = dl.listen(socket);
    delivery.on('receive.success', function(file) {
        console.log("name " + file.name);
        var fileDirectory = files.findFileDirectory(file.name);
        if (!fs.existsSync(fileDirectory)) {
            makeDir.mkdirSync(fileDirectory);
        }
        fs.writeFile(file.name, file.buffer, function(err) {
            if (err) {
                console.log('File could not be saved: ' + err);
            } else {
                console.log('File ' + file.name + " saved");
            };
        });
    });
}

http.listen(port, function() {
    console.log('listening on *:' + port);
    connectToRouteServer(routeIP);
    deleteController.watchOnFileDeletion(workingDirectory, function() {
        if (isLogin) {
            var data = files.traverseFileSystem(workingDirectory, files.createObject());
            serverSocket.emit('filesNames', data);
        }
    });
    deleteController.sync(files.getFilesData(workingDirectory));
});