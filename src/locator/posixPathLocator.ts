import { RubyInterpreterInfo } from "../types";
import { Kind, Locator, PathInfo, convToRubyInterpreterInfo, findRubyBinaries } from "./utils";

// The following paths are borrowed from microsoft/vscode-python.
// https://github.com/microsoft/vscode-python/blob/v2023.20.0/src/client/pythonEnvironments/common/posixUtils.ts#L40-L68
const knownDirectories: string[] = [
    "/bin",
    "/etc",
    "/lib",
    "/lib/x86_64-linux-gnu",
    "/lib64",
    "/sbin",
    "/snap/bin",
    "/usr/bin",
    "/usr/games",
    "/usr/include",
    "/usr/lib",
    "/usr/lib/x86_64-linux-gnu",
    "/usr/lib64",
    "/usr/libexec",
    "/usr/local",
    "/usr/local/bin",
    "/usr/local/etc",
    "/usr/local/games",
    "/usr/local/lib",
    "/usr/local/sbin",
    "/usr/sbin",
    "/usr/share",
    "~/.local/bin",
];

export class PosixPathLocator implements Locator {
    kind: Kind;
    constructor() {
        this.kind = Kind.Posix;
    }
    async execute(): Promise<RubyInterpreterInfo[]> {
        const interpreterPaths: string[] = [];
        for (const dir of knownDirectories) {
            const binFiles = await findRubyBinaries(dir);
            for (const bin of binFiles) {
                interpreterPaths.push(bin);
            }
        }
        return convToRubyInterpreterInfo({ kind: this.kind, interpreterPaths });
    }
}
