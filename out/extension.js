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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const treeView_1 = require("./treeView");
const storage_1 = require("./storage");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const treeView = new treeView_1.TreeView(context);
        let addCommand = vscode.commands.registerCommand("command-store.addCommandItem", () => __awaiter(this, void 0, void 0, function* () {
            const name = yield vscode.window.showInputBox({
                prompt: `New command name`,
                placeHolder: `Please type comand name here. ex: yourNewCmd`,
            });
            if (name) {
                const commandLine = yield vscode.window.showInputBox({
                    prompt: `New command line`,
                    placeHolder: `Please type command line here. ex: ls`,
                });
                if (commandLine) {
                    treeView.addNode({ name, commandLine });
                }
            }
        }));
        let refreshCommandList = vscode.commands.registerCommand("command-store.refreshCommandList", () => __awaiter(this, void 0, void 0, function* () {
            yield storage_1.storageExplorer.getCommmand();
        }));
        context.subscriptions.push(addCommand);
        context.subscriptions.push(refreshCommandList);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map