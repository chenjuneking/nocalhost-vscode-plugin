import { spawn } from "child_process";
import host, { Host } from "../host";
import * as shell from "shelljs";
import DataCenter, { ICtlResponse } from "../common/DataCenter";
export interface ShellResult {
  code: number;
  stdout: string;
  stderr: string;
}

export async function execAsyncWithReturn(
  command: string,
  args: Array<any>,
  cached = true
): Promise<ShellResult> {
  // host.log(`[cmd] ${command}`, true);
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const env = Object.assign(process.env, { DISABLE_SPINNER: true });
    const proc = spawn(command, args, { shell: true, env });
    let stdout = "";
    let stderr = "";
    proc.on("close", (code) => {
      if (code === 0) {
        if (cached) {
          const dataCenter: DataCenter = DataCenter.getInstance();
          const ctlResponse:
            | ICtlResponse
            | undefined = dataCenter.getCtlResponse(command, args);
          if (ctlResponse) {
            resolve(ctlResponse.result);
            return;
          }
          dataCenter.setCtlResponse(command, args, { stdout, stderr, code });
        }
        resolve({ stdout, stderr, code });
      } else {
        reject(stderr);
      }
    });

    proc.stdout.on("data", function (data) {
      stdout += data;
    });

    proc.stderr.on("data", function (data) {
      stderr += data;
    });
  });
}

export async function execChildProcessAsync(
  host: Host,
  command: string,
  args: Array<any>,
  errorTips?: string
) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const env = Object.assign(process.env, { DISABLE_SPINNER: true });
    const proc = spawn(command, args, { shell: true, env });
    let errorStr = "";
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(errorTips || `execute command fail: ${command}`);
      }
    });

    proc.stdout.on("data", function (data) {
      host.log("" + data);
    });

    proc.stderr.on("data", function (data) {
      errorStr += data + "";
      if (errorStr) {
        host.showErrorMessage(errorStr);
      }
      host.log("" + data);
    });
  });
}

export function which(name: string) {
  const result = shell.which(name);
  if (result && result.code === 0) {
    return true;
  }

  return false;
}
