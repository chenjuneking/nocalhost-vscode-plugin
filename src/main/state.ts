import * as vscode from "vscode";
import { BaseNocalhostNode } from "./nodes/types/nodeType";

class State {
  private login = false;

  private stateMap = new Map<string, any>();
  private nodeMap = new Map<string, BaseNocalhostNode>();

  private running = false;

  public getNode(id: string | undefined) {
    if (id) {
      return this.nodeMap.get(id);
    }
  }

  public setNode(id: string, node: BaseNocalhostNode) {
    this.nodeMap.set(id, node);
  }

  public isLogin() {
    return this.login;
  }

  public isRunning() {
    return this.running;
  }

  async setLogin(state: boolean) {
    await vscode.commands.executeCommand("setContext", "login", state);
    await vscode.commands.executeCommand("Nocalhost.refresh");
    this.login = state;
  }

  setRunning(running: boolean) {
    this.running = running;
  }

  get(key: string) {
    return this.stateMap.get(key);
  }

  delete(key: string, args?: { refresh: boolean; node?: BaseNocalhostNode }) {
    this.stateMap.delete(key);
    if (args && args.refresh) {
      vscode.commands.executeCommand("Nocalhost.refresh", args.node);
    }
  }

  set(
    key: string,
    value: any,
    args?: { refresh: boolean; node?: BaseNocalhostNode }
  ) {
    this.stateMap.set(key, value);
    if (args && args.refresh) {
      vscode.commands.executeCommand("Nocalhost.refresh", args.node);
    }
  }

  getAllAppState(appName: string) {
    let appMap: Map<string, any> = this.get(appName);
    if (!appMap) {
      appMap = new Map<string, any>();
    }

    return appMap;
  }

  async setAppState(
    appName: string,
    key: string,
    value: any,
    args?: { refresh: boolean; nodeStateId?: string }
  ) {
    const appMap = this.getAllAppState(appName);
    appMap.set(key, value);
    if (args && args.refresh) {
      await vscode.commands.executeCommand(
        "Nocalhost.refresh",
        this.getNode(args.nodeStateId)
      );
    }
    this.set(appName, appMap);
  }

  getAppState(appName: string, key: string) {
    const appMap = this.getAllAppState(appName);
    return appMap.get(key);
  }

  async deleteAppState(
    appName: string,
    key: string,
    args?: { refresh: boolean; nodeStateId?: string }
  ) {
    const appMap = this.getAllAppState(appName);
    appMap.delete(key);
    if (args && args.refresh) {
      await vscode.commands.executeCommand(
        "Nocalhost.refresh",
        this.getNode(args.nodeStateId)
      );
    }
    this.set(appName, appMap);
  }
}

export default new State();
