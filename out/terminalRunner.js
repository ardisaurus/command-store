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
exports.TerminalRunner = void 0;
const vscode = require("vscode");
const events_1 = require("events");
class TerminalRunner extends events_1.EventEmitter {
    constructor() {
        super();
        this._terminal = null;
        this._disposable = this.subscribe();
    }
    subscribe() {
        let subscriptions = [];
        let listener = (terminal) => __awaiter(this, void 0, void 0, function* () {
            if (terminal && this._terminal) {
                const [evPid, localPid] = yield Promise.all([
                    terminal.processId,
                    this._terminal.processId,
                ]);
                if (evPid === localPid) {
                    this._terminal = null;
                    this.emit("closed");
                }
            }
        });
        vscode.window.onDidCloseTerminal(listener, this, subscriptions);
        return vscode.Disposable.from(subscriptions[0]);
    }
    show() {
        this._terminal.show(true);
    }
    getTerminal() {
        return this._terminal;
    }
    execute(command, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command) {
                let hasTerminal = vscode.window.terminals.length;
                this.createTerminal(options);
                if (typeof options === "object" && options !== null && !options.hide) {
                    this._terminal.show(true);
                }
                if (hasTerminal) {
                    yield vscode.commands.executeCommand("workbench.action.terminal.clear");
                }
                this._terminal.sendText(command);
                // console.log("> Run: ", command);
            }
        });
    }
    createTerminal(options) {
        if (!options) {
            return (this._terminal = vscode.window.createTerminal({
                name: "Command",
            }));
        }
        if (typeof options === "string") {
            options = { name: options };
        }
        if (typeof options === "object") {
            options = Object.assign({ name: "Command" }, options);
            if (!this._terminal || this._terminal.name !== options.name) {
                this._terminal =
                    vscode.window.terminals
                        .filter((x) => x.name === options.name)
                        .pop() || null;
            }
            if (!this._terminal) {
                this._terminal = vscode.window.createTerminal(options);
            }
        }
    }
    dispose() {
        this._disposable.dispose();
    }
}
exports.TerminalRunner = TerminalRunner;
//# sourceMappingURL=terminalRunner.js.map