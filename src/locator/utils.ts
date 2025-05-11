import path from "path";
import os from "os";
import fs from "fs";
import asyncfs from "fs/promises";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";

export const Kind = {
    // alphabetical order
    Asdf: "Asdf",
    Chruby: "Chruby",
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
    execute(): Promise<RubyInterpreterInfo[]>;
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

export async function convToRubyInterpreterInfo(pathInfo: PathInfo): Promise<RubyInterpreterInfo[]> {
    const interpreterInfo: RubyInterpreterInfo = {
        path: "",
    };
    switch (pathInfo.kind) {
        case Kind.Asdf:
            interpreterInfo.isAsdf = true;
            break;
        case Kind.EnvVar:
            interpreterInfo.isPathEnvVar = true;
            break;
        case Kind.Homebrew:
            interpreterInfo.isHomebrew = true;
            break;
        case Kind.Rbenv:
            interpreterInfo.isRbenv = true;
            break;
    }
    return pathInfo.interpreterPaths.map((path) => {
        const clone = structuredClone(interpreterInfo);
        clone.path = path;
        return clone;
    });
}
