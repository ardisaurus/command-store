import * as vscode from "vscode";
import { storageExplorer } from "./storage";
import { v4 as uuidv4 } from "uuid";
import { TerminalRunner } from "./terminalRunner";
import { Command } from "./command.interface";

export class TreeView {
  private _tdp = new TreeProvider();
  private _cmdList: Command[] = [];

  constructor(context: vscode.ExtensionContext) {
    vscode.window.registerTreeDataProvider("commandStoreTreeView", this._tdp);

    this.initNodes();

    vscode.commands.registerCommand(
      "commandStoreTreeView.selectNode",
      async (item: TreeItem) => {
        vscode.window.showInformationMessage(`Running ${item.label}`);
        const terminal = new TerminalRunner();
        await terminal.execute(item.commandLine!);
      }
    );

    vscode.commands.registerCommand(
      "commandStoreTreeView.viewNode",
      async (item: TreeItem) => {
        vscode.window.showInformationMessage(`${item.commandLine}`);
      }
    );

    vscode.commands.registerCommand(
      "commandStoreTreeView.removeNode",
      (item: TreeItem) => {
        vscode.window
          .showWarningMessage(
            `Do you want to do remove ${item.label}?`,
            ...["Yes", "No"]
          )
          .then((answer) => {
            if (answer === "Yes") {
              this.removeNode(item);
            }
          });
      }
    );
  }

  public async addNode({ name, commandLine }: any): Promise<any> {
    const id = uuidv4();
    const newList = [...this._cmdList, { id, name, commandLine }];
    await storageExplorer.setCommmand(newList);
    this._cmdList = newList;
    this._tdp.addItem({ name, id, commandLine });
    vscode.window.showInformationMessage(`${name} has been added`);
  }

  async removeNode(item: TreeItem) {
    const newList = this._cmdList.filter((el) => el.id !== item.itemId);
    await storageExplorer.setCommmand(newList);
    this._cmdList = newList;
    this._tdp.removeItem(item.itemId!);
    vscode.window.showInformationMessage(`${item.label} has been removed`);
  }

  async initNodes() {
    const commandList = await storageExplorer.getCommmand();
    this._cmdList = commandList;
    if (commandList.length > 0) {
      commandList.forEach((element: Command) => {
        this._tdp.addItem({
          name: element.name,
          commandLine: element.commandLine,
          id: element.id,
        });
      });
    }
  }
}

export class TreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  private _onDidChangeTreeData: vscode.EventEmitter<any> =
    new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> =
    this._onDidChangeTreeData.event;

  public refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  data: TreeItem[];

  constructor() {
    this.data = [];
  }

  getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return [...this.data];
    }
    return element.children;
  }

  public addItem({ name, commandLine, id }: Command): any {
    this.data = [
      ...this.data,
      new TreeItem(name, "commandItem", id, commandLine),
    ];
    this.refresh();
  }

  public removeItem(itemId: string): any {
    let treeData = this.data;
    let newTree = treeData.filter((item) => item.itemId !== itemId);
    this.data = newTree;
    this.refresh();
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  itemId?: string;
  commandLine: string | undefined;

  constructor(
    label: string,
    contextValue: string,
    itemId: string,
    commandLine: string,
    children?: TreeItem[]
  ) {
    super(
      label,
      children === undefined
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Expanded
    );
    this.contextValue = contextValue;
    this.children = children;
    this.itemId = itemId;
    this.commandLine = commandLine;
  }
}
