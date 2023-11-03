import path from "path";
import os from "os";
import fs from "fs";
import asyncfs from "fs/promises";

export const Kind = {
    // alphabetical order
    Asdf: "Asdf",
    EnvVar: "EnvVar",
    Posix: "Posix",
    Rbenv: "Rbenv",
    Homebrew: "Homebrew",
} as const;

export type Kind = (typeof Kind)[keyof typeof Kind];

export interface PathInfo {
    kind: Kind;
    interpreterPaths: string[];
}

export interface Locator {
    kind: Kind;
    execute(): Promise<PathInfo>;
}

export function getRbenvDir() {
    return process.env.RBENV_ROOT || path.join(os.homedir(), ".rbenv");
}

const rubyRegexp = /^ruby(\d)?(\.\d)?(\.\d)?$/;

export async function findRubyBinaries(dir: fs.PathLike) {
    const files = await asyncfs.readdir(dir, { withFileTypes: true });
    return files
        .filter((file) => file.isFile() && rubyRegexp.test(file.name))
        .map((file) => path.join(dir.toString(), file.name));
}
