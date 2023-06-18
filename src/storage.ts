import * as vscode from "vscode";
import { jsonInstance, doesExists } from "./utils";
import { join } from "path";
import { Command } from "./command.interface";

type saveLocationType = "root" | "workspace" | "application";

class StorageClass {
  private commandList: any = null;
  private saveLocation: saveLocationType = "root";

  getmConfig() {
    const currentDocument = vscode.window.activeTextEditor?.document;
    if (this.saveLocation === "workspace" && currentDocument?.uri) {
      return vscode.workspace.getConfiguration("", currentDocument.uri);
    } else {
      return vscode.workspace.getConfiguration("workbench");
    }
  }

  reloadConfiguration() {
    const configuration = vscode.workspace.getConfiguration();
    const configSavingLocation = configuration.get<saveLocationType>(
      "commandStore.configSavingLocation"
    );
    this.saveLocation = configSavingLocation || "root";

    if (this.saveLocation === "root") {
      this.commandList = jsonInstance("commandStore.vscode.json");
    } else {
      const mConfiguration = this.getmConfig();
      this.commandList = mConfiguration.get<Command[]>("commandStore.list");
    }
  }

  ensureStorageExist() {
    let isExist = false;
    if (this.saveLocation === "root") {
      isExist = doesExists([join("commandStore.vscode.json")]);
    } else {
      const mConfiguration = this.getmConfig();
      if (mConfiguration.get<Command[]>("commandStore.list")) {
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

  async getCommmand() {
    this.reloadConfiguration();
    if (this.ensureStorageExist() === false) {
      return [];
    }
    let commands: any[] = [];

    if (this.saveLocation === "root") {
      commands = this.commandList.db.get("commands").value() || [];
    } else {
      const mConfiguration = this.getmConfig();
      commands = mConfiguration.get<Command[]>("commandStore.list") || [];
    }
    return commands;
  }

  async setCommmand(value: Command[]) {
    try {
      if (this.saveLocation === "root") {
        this.commandList.db.set("commands", value).write();
      } else {
        const mConfiguration = this.getmConfig();
        const currentDocument = vscode.window.activeTextEditor?.document;
        if (this.saveLocation === "workspace" && currentDocument?.uri) {
          await mConfiguration.update(
            "commandStore.list",
            value,
            vscode.ConfigurationTarget.Workspace
          );
        } else {
          await mConfiguration.update(
            "commandStore.list",
            value,
            vscode.ConfigurationTarget.Global
          );
        }
      }

      return value;
    } catch (error: any) {
      vscode.window.showErrorMessage(error.message);
      console.error(error);
      return false;
    }
  }
}

export const storageExplorer = new StorageClass();
