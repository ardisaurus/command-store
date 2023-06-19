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
exports.TreeProvider = exports.TreeView = void 0;
const vscode = require("vscode");
const storage_1 = require("./storage");
const uuid_1 = require("uuid");
const terminalRunner_1 = require("./terminalRunner");
class TreeView {
    constructor(context) {
        this._tdp = new TreeProvider();
        this._cmdList = [];
        vscode.window.registerTreeDataProvider("commandStoreTreeView", this._tdp);
        this.initNodes();
        vscode.commands.registerCommand("commandStoreTreeView.selectNode", (item) => __awaiter(this, void 0, void 0, function* () {
            vscode.window.showInformationMessage(`Running ${item.label}`);
            const terminal = new terminalRunner_1.TerminalRunner();
            yield terminal.execute(item.commandLine);
        }));
        vscode.commands.registerCommand("commandStoreTreeView.viewNode", (item) => __awaiter(this, void 0, void 0, function* () {
            vscode.window.showInformationMessage(`${item.commandLine}`);
        }));
        vscode.commands.registerCommand("commandStoreTreeView.removeNode", (item) => {
            vscode.window
                .showWarningMessage(`Do you want to do remove ${item.label}?`, ...["Yes", "No"])
                .then((answer) => {
                if (answer === "Yes") {
                    this.removeNode(item);
                }
            });
        });
    }
    addNode({ name, commandLine }) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = uuid_1.v4();
            const newList = [...this._cmdList, { id, name, commandLine }];
            const isAdded = yield storage_1.storageExplorer.setCommmand(newList);
            if (isAdded) {
                this._cmdList = newList;
                this._tdp.addItem({ name, id, commandLine });
                vscode.window.showInformationMessage(`${name} has been added`);
            }
        });
    }
    removeNode(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const newList = this._cmdList.filter((el) => el.id !== item.itemId);
            yield storage_1.storageExplorer.setCommmand(newList);
            this._cmdList = newList;
            this._tdp.removeItem(item.itemId);
            vscode.window.showInformationMessage(`${item.label} has been removed`);
        });
    }
    initNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            const commandList = yield storage_1.storageExplorer.getCommmand();
            this._cmdList = commandList;
            if (commandList.length > 0) {
                commandList.forEach((element) => {
                    this._tdp.addItem({
                        name: element.name,
                        commandLine: element.commandLine,
                        id: element.id,
                    });
                });
            }
        });
    }
}
exports.TreeView = TreeView;
class TreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.data = [];
    }
    getTreeItem(element) {
        return element;
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getChildren(element) {
        if (element === undefined) {
            return [...this.data];
        }
        return element.children;
    }
    addItem({ name, commandLine, id }) {
        this.data = [
            ...this.data,
            new TreeItem(name, "commandItem", id, commandLine),
        ];
        this.refresh();
    }
    removeItem(itemId) {
        let treeData = this.data;
        let newTree = treeData.filter((item) => item.itemId !== itemId);
        this.data = newTree;
        this.refresh();
    }
}
exports.TreeProvider = TreeProvider;
class TreeItem extends vscode.TreeItem {
    constructor(label, contextValue, itemId, commandLine, children) {
        super(label, children === undefined
            ? vscode.TreeItemCollapsibleState.None
            : vscode.TreeItemCollapsibleState.Expanded);
        this.contextValue = contextValue;
        this.children = children;
        this.itemId = itemId;
        this.commandLine = commandLine;
    }
}
//# sourceMappingURL=treeView.js.map