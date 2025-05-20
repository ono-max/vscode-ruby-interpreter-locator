import { promisify } from "util";
import { RubyInterpreterInfo } from "./rubyInterpreterInfo";
import { exec } from "child_process";
import { join } from "path";
import asyncfs from "fs/promises";

// This function is exported for testing purposes.
export const asyncExec = promisify(exec);

export class RubyInterpreterSorter {
    private rubyInterpreterInfoPromises: Promise<RubyInterpreterInfo[]>;
    private cwd: string;
    private dotRubyVersion: string | null = null;
    constructor(rubyInterpreterInfoPromises: Promise<RubyInterpreterInfo[]>, cwd: string) {
        this.rubyInterpreterInfoPromises = rubyInterpreterInfoPromises;
        this.cwd = cwd;
    }
    public async execute(): Promise<RubyInterpreterInfo[]> {
        const rubyInterpreterInfos = await this.rubyInterpreterInfoPromises;
        this.dotRubyVersion = await this.readDotRubyVersion();
        return rubyInterpreterInfos.sort(this.compare.bind(this));
    }

    private isVersionManager(info: RubyInterpreterInfo): boolean {
        // If the environment is managed by a version manager, we give it a higher priority.
        if (info.isAsdf || info.isChruby || info.isRbenv || info.isRvm) {
            return true;
        }
        return false;
    }

    private compare(a: RubyInterpreterInfo, b: RubyInterpreterInfo): number {
        if (this.dotRubyVersion) {
            if (this.isDotRubyVersionCompatible(a) && a.version === this.dotRubyVersion) {
                return -1; // a is preferred
            }
            if (this.isDotRubyVersionCompatible(b) && b.version === this.dotRubyVersion) {
                return 1; // b is preferred
            }
        }
        if (this.isVersionManager(a) && !this.isVersionManager(b)) {
            return -1; // a is preferred
        }
        if (!this.isVersionManager(a) && this.isVersionManager(b)) {
            return 1; // b is preferred
        }
        return 0;
    }

    private isDotRubyVersionCompatible(info: RubyInterpreterInfo): boolean {
        // chruby: https://github.com/postmodern/chruby?tab=readme-ov-file#features
        // rbenv: https://github.com/rbenv/rbenv?tab=readme-ov-file#how-it-works
        // rvm: https://github.com/rvm/rvm?tab=readme-ov-file#switching-between-ruby-versions)
        return info.isChruby || info.isRbenv || info.isRvm;
    }

    private async readDotRubyVersion() {
        const rubyVersionFile = join(this.cwd, ".ruby-version");
        try {
            const version = await asyncfs.readFile(rubyVersionFile, "utf8");
            return version.trim();
        } catch (error) {
            return null;
        }
    }
}
