import * as vscode from "vscode";

import { TreeView } from "./treeView";
import { storageExplorer } from "./storage";

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

  let refreshCommandList = vscode.commands.registerCommand(
    "command-store.refreshCommandList",
    async () => {
      const currentDocument = vscode.window.activeTextEditor?.document;
      const saveLocation = vscode.workspace
        .getConfiguration()
        .get<string>("commandStore.configSavingLocation");
      if (saveLocation === "workspace" && !currentDocument?.uri) {
        vscode.window.showErrorMessage(
          "Open a file inside your project folder."
        );
      } else {
        await storageExplorer.getCommmand();
      }
    }
  );

  context.subscriptions.push(addCommand);
  context.subscriptions.push(refreshCommandList);
}

export function deactivate() {}
