import path from "path";
import os from "os";
import fs, { ObjectEncodingOptions, PathLike } from "fs";
import asyncfs from "fs/promises";
import { RubyInterpreterInfo } from "../types";

export const Kind = {
    // alphabetical order
    Asdf: "Asdf",
    Chruby: "Chruby",
    EnvVar: "EnvVar",
    Posix: "Posix",
    Rbenv: "Rbenv",
    Rvm: "Rvm",
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
    const files = await safeReadDir(dir, { withFileTypes: true });
    return files
        .filter((file) => file.isFile() && rubyRegexp.test(file.name))
        .map((file) => path.join(dir.toString(), file.name));
}

export async function findDir(dir: fs.PathLike) {
    const files = await safeReadDir(dir, { withFileTypes: true });
    return files.map((file) => path.join(dir.toString(), file.name));
}

export async function findFiles(dir: fs.PathLike) {
    const files = await safeReadDir(dir, { withFileTypes: true });
    return files.filter((file) => file.isFile()).map((file) => path.join(dir.toString(), file.name));
}

async function safeReadDir(
    dir: PathLike,
    options: ObjectEncodingOptions & {
        withFileTypes: true;
        recursive?: boolean | undefined;
    },
) {
    try {
        return await asyncfs.readdir(dir, options);
    } catch {
        return [];
    }
}

export async function convToRubyInterpreterInfo(pathInfo: PathInfo): Promise<RubyInterpreterInfo[]> {
    const interpreterInfo: RubyInterpreterInfo = {
        path: "",
        isAsdf: false,
        isChruby: false,
        isPathEnvVar: false,
        isRbenv: false,
        isRvm: false,
        isHomebrew: false,
    };
    switch (pathInfo.kind) {
        // alphabetical order
        case Kind.Asdf:
            interpreterInfo.isAsdf = true;
            break;
        case Kind.Chruby:
            interpreterInfo.isChruby = true;
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
        case Kind.Rvm:
            interpreterInfo.isRvm = true;
            break;
    }
    return pathInfo.interpreterPaths.map((path) => {
        const clone = structuredClone(interpreterInfo);
        clone.path = path;
        return clone;
    });
}
