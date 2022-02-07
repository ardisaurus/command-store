import * as vscode from "vscode";

import { TreeView } from "./treeView";

export async function activate(context: vscode.ExtensionContext) {
  const treeView = new TreeView(context);

  let addCommand = vscode.commands.registerCommand(
    "command-store.addCommandItem",
    async () => {
      const name = await vscode.window.showInputBox({
        prompt: `New command name`,
        placeHolder: `Please type comand name here. ex: yourNewCmd`,
      });
      if (name) {
        const commandLine = await vscode.window.showInputBox({
          prompt: `New command line`,
          placeHolder: `Please type command line here. ex: ls`,
        });
        if (commandLine) {
          treeView.addNode({ name, commandLine });
        }
      }
    }
  );

  context.subscriptions.push(addCommand);
}

export function deactivate() {}
