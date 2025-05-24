import { Memento } from "vscode";

export interface RubyInterpreterInfo {
    path: string;
    version?: string;
    gemHome?: string[];
    // alphabetical order
    isAsdf: boolean;
    isChruby: boolean;
    isPathEnvVar: boolean;
    isRbenv: boolean;
    isRvm: boolean;
    isHomebrew: boolean;
}
export type GlobalState = Memento & { setKeysForSync(keys: readonly string[]): void };
