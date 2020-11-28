import * as vscode from "vscode";
import { login } from "../api";
import state from "../state";

export default function showLogin() {
  vscode.window
    .showInputBox({ placeHolder: "please input your email" })
    .then((email) => {
      if (!email) {
        return;
      }
      vscode.window
        .showInputBox({ placeHolder: "please input password" })
        .then((password) => {
          if (!password) {
            return;
          }
          login({ email, password })
            .then((result) => {
              if (result) {
                state.setLogin(true);
                vscode.window.showInformationMessage("login successful");
              }
            })
            .catch((err) => {
              vscode.window.showWarningMessage(err.message);
            })
            .finally(() => {
              vscode.commands.executeCommand("getApplicationList");
            });
        });
    });
}