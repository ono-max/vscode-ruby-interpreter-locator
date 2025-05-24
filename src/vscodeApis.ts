import { workspace, WorkspaceFolder } from "vscode";

export function getActiveWorkspaceFolder(): WorkspaceFolder | undefined {
    if (!workspace.workspaceFolders) {
        return undefined;
    }
    if (workspace.workspaceFolders.length === 1) {
        return workspace.workspaceFolders[0];
    }
    // TODO: Figure out how to handle multiple workspaces.
    return workspace.workspaceFolders[0];
}
