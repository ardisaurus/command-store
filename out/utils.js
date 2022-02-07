"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesExists = exports.resolveProjectPath = exports.jsonInstance = exports.readJson = exports.writeFileAsync = exports.existsAsync = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const vscode = require("vscode");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
exports.existsAsync = util_1.promisify(fs_1.exists);
exports.writeFileAsync = util_1.promisify(fs_1.writeFile);
function readJson(jsonFilePath) {
    delete require.cache[require.resolve(jsonFilePath)];
    return require(jsonFilePath);
}
exports.readJson = readJson;
function jsonInstance(...args) {
    const filePath = resolveProjectPath(...args);
    // console.log(filePath);
    const adapter = new FileSync(filePath);
    const db = low(adapter);
    db.defaults({ commands: [] }).write();
    return {
        db,
        filePath,
    };
}
exports.jsonInstance = jsonInstance;
function resolveProjectPath(...args) {
    const folderPath = (vscode.workspace.workspaceFolders || [
        { uri: { fsPath: "" } },
    ])[0];
    return path_1.join(folderPath.uri.fsPath, ...args);
}
exports.resolveProjectPath = resolveProjectPath;
function doesExists(filename) {
    try {
        const fileEntries = filename.map((name) => resolveProjectPath(name));
        fileEntries.forEach((filePath) => {
            return fs_1.accessSync(filePath);
        }); // will throw error if not exist
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.doesExists = doesExists;
//# sourceMappingURL=utils.js.map