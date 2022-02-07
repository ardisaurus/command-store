import * as vscode from "vscode";
import { jsonInstance, doesExists } from "./utils";
import { join } from "path";
import { Command } from "./command.interface";

class StorageClass {
  private commandList: any = null;

  reloadConfiguration() {
    this.commandList = jsonInstance("commandStore.vscode.json");
  }

  ensureStorageExist() {
    const isExist = doesExists([join("commandStore.vscode.json")]);
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
    const commands = this.commandList.db.get("commands").value() || [];
    return commands;
  }

  async setCommmand(value: Command[]) {
    try {
      this.commandList.db.set("commands", value).write();
      return value;
    } catch (error: any) {
      vscode.window.showErrorMessage(error.message);
      console.error(error);
      return false;
    }
  }
}

export const storageExplorer = new StorageClass();
