const fs = require('fs');
const path = require('path');
// var Watcher = require('watch-fs').Watcher; jnj
var filesData = [];
// var json = require('json-object').setup(global);

/**
 * creates an empty object to use in each step while constructing file hierarchy
 * @returns object containing an array of files, the name of current file or
 * directory, an array of directories
 */
function createObject() {
    return {
        files: [],
        name: '',
        dirs: []
    };
};

/**
 * constructing the hierarchy tree of files and
 * subdirectories of the given path
 * @param {*} currentPath 
 * @param {*} obj 
 * @returns an object containing an array of files, file name, 
 * an array of directories
 */
function traverseFileSystem(currentPath, obj) {
    obj.name = findFileName(currentPath);
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
        var currentFile = currentPath + '/' + files[i];
        var stats = fs.statSync(currentFile);
        if (stats.isFile()) {
            obj.files.push(files[i]);
        } else if (stats.isDirectory()) {
            obj.dirs.push(traverseFileSystem(currentFile, createObject()));
        }
    }
    return obj;
};

// This function for reading files and directories from working directory 
function findFilesData(pathToFile) {
    var files = fs.readdirSync(pathToFile);
    for (var i in files) {
        var currentFile = pathToFile + '/' + files[i];
        var stats = fs.statSync(currentFile);
        if (stats.isFile()) {
            var fileObj = {
                "name": files[i],
                "filePath": currentFile,
                "stats": stats
            };
            filesData.push(fileObj);
        } else if (stats.isDirectory()) {
            findFilesData(currentFile);
        }
    }
}

// This function for return all files of working directory 
function getFilesData(pathToFile) {
    findFilesData(pathToFile);
    var tempFiles = filesData;
    filesData = [];
    return tempFiles;
}

// This function compare clients files with servers files and change clients 
function comparePeersFiles(clientFiles, serverFiles) {
    var syncFiles = [];
    for (var i in serverFiles) {
        var isSame = false;
        for (var j in clientFiles) {
            if (serverFiles[i].name == clientFiles[j].name) {
                isSame = true;
                var serverFileMtime = Date.parse(serverFiles[i].stats.mtime);
                var clientFileMtime = Date.parse(clientFiles[j].stats.mtime);
                if (serverFileMtime > clientFileMtime) {
                    syncFiles.push(serverFiles[i]);
                } else break;
            }
        }
        if (!isSame) {
            syncFiles.push(serverFiles[i]);
        }
    }
    return syncFiles;
}

/**
 * gets the name of file from the given path
 * @param {*} path 
 * @returns the name of file
 */
function findFileName(path) {
    var index = path.lastIndexOf('/');
    return path.slice(index + 1);
};

/**
 * gets the directory of the file from the given path
 * @param {*} path 
 * @returns the directory of the file
 */
function findFileDirectory(path) {
    return path.substring(0, path.lastIndexOf("/"));
};



/**
 * attaching the required fields to use outside of this scope
 */
module.exports.traverseFileSystem = traverseFileSystem;
module.exports.createObject = createObject;
module.exports.getFilesData = getFilesData;
module.exports.comparePeersFiles = comparePeersFiles;
module.exports.findFileDirectory = findFileDirectory;
