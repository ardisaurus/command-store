import { exists, accessSync, writeFile } from "fs";
import { promisify } from "util";
import { join } from "path";
import * as vscode from "vscode";
import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";

export const existsAsync = promisify(exists);
export const writeFileAsync = promisify(writeFile);

export function readJson(jsonFilePath: string) {
  delete require.cache[require.resolve(jsonFilePath)];
  return require(jsonFilePath);
}

export function jsonInstance(...args: string[]) {
  const filePath = resolveProjectPath(...args);
  // console.log(filePath);
  const adapter = new FileSync(filePath);
  const db = low(adapter);
  db.defaults({ commands: [] }).write();
  return {
    db,
    filePath,
  };
}

export function resolveProjectPath(...args: string[]) {
  const folderPath = (vscode.workspace.workspaceFolders || [
    { uri: { fsPath: "" } },
  ])[0];
  return join(folderPath.uri.fsPath, ...args);
}

export function doesExists(filename: string[]) {
  try {
    const fileEntries = filename.map((name) => resolveProjectPath(name));
    fileEntries.forEach((filePath) => {
      return accessSync(filePath);
    }); // will throw error if not exist
    return true;
  } catch (e) {
    return false;
  }
}
