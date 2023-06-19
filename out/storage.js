"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageExplorer = void 0;
const vscode = require("vscode");
const utils_1 = require("./utils");
const path_1 = require("path");
class StorageClass {
    constructor() {
        this.commandList = null;
        this.saveLocation = "root";
    }
    getmConfig() {
        var _a;
        const currentDocument = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        if (this.saveLocation === "workspace" && (currentDocument === null || currentDocument === void 0 ? void 0 : currentDocument.uri)) {
            return vscode.workspace.getConfiguration("", currentDocument.uri);
        }
        return vscode.workspace.getConfiguration("workbench");
    }
    reloadConfiguration() {
        const configuration = vscode.workspace.getConfiguration();
        const configSavingLocation = configuration.get("commandStore.configSavingLocation");
        this.saveLocation = configSavingLocation || "root";
        if (this.saveLocation === "root") {
            this.commandList = utils_1.jsonInstance("commandStore.vscode.json");
        }
        else {
            const mConfiguration = this.getmConfig();
            this.commandList = mConfiguration.get("commandStore.list");
        }
    }
    ensureStorageExist() {
        let isExist = false;
        if (this.saveLocation === "root") {
            isExist = utils_1.doesExists([path_1.join("commandStore.vscode.json")]);
        }
        else {
            const mConfiguration = this.getmConfig();
            if (mConfiguration.get("commandStore.list")) {
                isExist = true;
            }
        }
        if (!isExist) {
            this.commandList = null;
            return false;
        }
        if (!this.commandList) {
            this.reloadConfiguration();
        }
        return true;
    }
    getCommmand() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.reloadConfiguration();
            if (this.ensureStorageExist() === false) {
                return [];
            }
            let commands = [];
            if (this.saveLocation === "root") {
                commands = this.commandList.db.get("commands").value() || [];
            }
            else {
                const currentDocument = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
                if (this.saveLocation === "workspace" && !(currentDocument === null || currentDocument === void 0 ? void 0 : currentDocument.uri)) {
                    commands = [];
                    vscode.window.showErrorMessage("Open a file inside your project folder.");
                }
                else {
                    const mConfiguration = this.getmConfig();
                    commands = mConfiguration.get("commandStore.list") || [];
                }
            }
            return commands;
        });
    }
    setCommmand(value) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.saveLocation === "root") {
                    this.commandList.db.set("commands", value).write();
                }
                else {
                    const mConfiguration = this.getmConfig();
                    if (this.saveLocation === "workspace") {
                        const currentDocument = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
                        if (currentDocument === null || currentDocument === void 0 ? void 0 : currentDocument.uri) {
                            yield mConfiguration.update("commandStore.list", value, vscode.ConfigurationTarget.Workspace);
                        }
                        else {
                            vscode.window.showErrorMessage("Open a file inside your project folder.");
                        }
                    }
                    else {
                        yield mConfiguration.update("commandStore.list", value, vscode.ConfigurationTarget.Global);
                    }
                }
                return value;
            }
            catch (error) {
                vscode.window.showErrorMessage(error.message);
                console.error(error);
                return false;
            }
        });
    }
}
exports.storageExplorer = new StorageClass();
//# sourceMappingURL=storage.js.map