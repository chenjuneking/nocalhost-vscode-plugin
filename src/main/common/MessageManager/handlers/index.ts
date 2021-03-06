import * as vscode from "vscode";
import { IMessage } from "..";
import fetchLogs from "./fetchLogs";
import fetchDeployments from "./fetchDeployments";
import updateURL from "./updateURL";

export default function (message: IMessage, id: number) {
  const { type } = message;
  switch (type) {
    case "executeCommand":
      return vscode.commands.executeCommand(message.payload?.command);
    case "logs/fetch":
      return fetchLogs(message, id);
    case "deployments/fetch":
      return fetchDeployments(message, id);
    case "url/update": {
      return updateURL(message, id);
    }
    default:
      return;
  }
}
