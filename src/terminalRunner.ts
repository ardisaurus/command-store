import * as vscode from "vscode";
import { EventEmitter } from "events";

export class TerminalRunner extends EventEmitter {
  private _terminal: vscode.Terminal | null;
  private _disposable: vscode.Disposable | null;

  constructor() {
    super();
    this._terminal = null;
    this._disposable = this.subscribe();
  }

  subscribe() {
    let subscriptions: any = [];
    let listener = async (terminal: vscode.Terminal) => {
      if (terminal && this._terminal) {
        const [evPid, localPid] = await Promise.all([
          terminal.processId,
          this._terminal.processId,
        ]);
        if (evPid === localPid) {
          this._terminal = null;
          this.emit("closed");
        }
      }
    };

    vscode.window.onDidCloseTerminal(listener, this, subscriptions);
    return vscode.Disposable.from(subscriptions[0]);
  }

  show() {
    this._terminal!.show(true);
  }

  getTerminal() {
    return this._terminal;
  }

  async execute(command: string, options: any = {}) {
    if (command) {
      let hasTerminal = vscode.window.terminals.length;
      this.createTerminal(options);

      if (typeof options === "object" && options !== null && !options.hide) {
        this._terminal!.show(true);
      }

      if (hasTerminal) {
        await vscode.commands.executeCommand("workbench.action.terminal.clear");
      }

      this._terminal!.sendText(command);
      // console.log("> Run: ", command);
    }
  }

  createTerminal(options: any) {
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

      if (!this._terminal || this._terminal!.name !== options.name) {
        this._terminal =
          vscode.window.terminals
            .filter((x: vscode.Terminal) => x.name === options.name)
            .pop() || null;
      }
      if (!this._terminal) {
        this._terminal = vscode.window.createTerminal(options);
      }
    }
  }

  dispose() {
    this._disposable!.dispose();
  }
}
