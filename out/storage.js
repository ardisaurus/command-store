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
    }
    reloadConfiguration() {
        this.commandList = utils_1.jsonInstance("commandStore.vscode.json");
    }
    ensureStorageExist() {
        const isExist = utils_1.doesExists([path_1.join("commandStore.vscode.json")]);
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
        return __awaiter(this, void 0, void 0, function* () {
            this.reloadConfiguration();
            if (this.ensureStorageExist() === false) {
                return [];
            }
            const commands = this.commandList.db.get("commands").value() || [];
            return commands;
        });
    }
    setCommmand(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.commandList.db.set("commands", value).write();
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