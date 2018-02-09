var chokidar = require('chokidar');
var fs = require('fs');


//function for watching file deletion
function watchOnFileDeletion(workDirPath, cb) {
    var watcher = chokidar.watch(workDirPath, {
        persistent: true
    });
    watcher.on('unlink', function (unlinkedFilePath) {
        cb();
        var obj = {
            'path': unlinkedFilePath,
            'time': new Date(),
            'status': 'deleted'
        };
        addObjInFile(obj);
    });
}

function addObjInFile(obj) {
    fs.readFile('deletedFilesList.json', function (err, data) {
        var parsed_data = JSON.parse(data);
        findObjCheckStatus(obj, parsed_data);
        fs.writeFile('deletedFilesList.json', JSON.stringify(parsed_data));
    });
}

function findObjCheckStatus(element, arr) {
    for(var el of arr) {
        var absent = false;
        if(el.path === element.path) {
            el.time = new Date();
            el.status = 'deleted';
            absent = false;
            break;
        }
        absent = true;
    }
    if(absent) {
        arr.push(element);
    }
}


function writeInFile(arr) {
    fs.writeFile('deletedFilesList.json', JSON.stringify(arr));
}


function addArrToJson(arr) {
    for (var i = 0; i < arr.length; i++) {
        var tempObj = {
            'path': arr[i].filePath,
            'time': arr[i].stats.mtime,
            'status': 'exists'
        };
        addObjInFile(tempObj);
    }
}

function syncJsonWithFile(arrJson, arrPath) {
    for (var json of arrJson) {
        var stopped = false;
        for (var file of arrPath) {
            if (json.status === 'exists' && json.path === file.filePath) {
                stopped = true;
                break;
            }
            if (json.status === 'deleted' && json.path === file.filePath) {
                json.status = 'exists';
                stopped = true;
                break;
            }
        }
        if (!stopped) {
            if (json.status == 'exists') {
                json.status = 'deleted';
                json.time = new Date();
            }
        }
    }

    writeInFile(addAbsentInJson(arrJson, arrPath));
}

function addAbsentInJson(arrJson, arrPath) {
    var absentArr = [];
    for (var file of arrPath) {
        var absent = false;
        for (var json of arrJson) {
            if (file.filePath === json.path) {
                absent = false;
                break;
            }
            absent = true;
        }
        if (absent) {
            absentArr.push({
                'path': file.filePath,
                'time': null,
                'status': 'exists'
            });
        }
    }
    return arrJson.concat(absentArr);
}


function sync(arrPath) {
    fs.readFile('deletedFilesList.json', function (err, data) {
        var arrJson = JSON.parse(data);
        console.log("in read " + arrJson.length);
        syncJsonWithFile(arrJson, arrPath);
    });
}


function sendDeletedObj(cb) {
    fs.readFile('deletedFilesList.json', function (err, data) {
        var arrJson = JSON.parse(data);
        var dellArr = [];
        for(var del of arrJson) {
            if(del.status === 'deleted'){
                dellArr.push(del);
            }
        }
        cb(dellArr);
    });
}




module.exports.watchOnFileDeletion = watchOnFileDeletion;
module.exports.sync = sync;
module.exports.sendDeletedObj = sendDeletedObj;