import { promisify } from "util";
import { RubyInterpreterInfo } from "./rubyInterpreterInfo";
import { exec } from "child_process";
import { join } from "path";
import { readFile } from "fs/promises";

// This function is exported for testing purposes.
export const asyncExec = promisify(exec);

const versionRegexp = /^(\d+).(\d+).(\d+)$/;

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

    private getEnvPriority(info: RubyInterpreterInfo): number {
        // If the environment is managed by a version manager, we give it a higher priority.
        // This priority is determined by the number of stars on GitHub at 2025-05-21.
        if (info.isRbenv) {
            return 1; // 16.4k
        }
        if (info.isRvm) {
            return 2; // 5.2k
        }
        if (info.isChruby) {
            return 3; // 2.9k
        }
        if (info.isAsdf) {
            return 4; // 695
        }

        // These are not version managers, so we give them a lower priority.
        if (info.isHomebrew) {
            return 5;
        }
        if (info.isPathEnvVar) {
            return 6;
        }
        return 7;
    }

    private compareVersions(a: RubyInterpreterInfo, b: RubyInterpreterInfo): number {
        if (a.version !== undefined && b.version === undefined) {
            return -1; // a is preferred
        }
        if (a.version === undefined && b.version !== undefined) {
            return 1; // b is preferred
        }
        if (a.version === undefined && b.version === undefined) {
            return 0; // equal
        }
        const aVersion = versionRegexp.exec(a.version!);
        const bVersion = versionRegexp.exec(b.version!);
        if (aVersion && aVersion.length === 4 && bVersion && bVersion.length === 4) {
            for (let i = 1; i < 4; i++) {
                const a = parseInt(aVersion[i], 10);
                const b = parseInt(bVersion[i], 10);
                if (a != b) {
                    return Math.sign(b - a);
                }
            }
        }
        return 0; // equal
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
        const aEnvPriority = this.getEnvPriority(a);
        const bEnvPriority = this.getEnvPriority(b);
        return Math.sign(aEnvPriority - bEnvPriority) || this.compareVersions(a, b);
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
            const version = await readFile(rubyVersionFile, "utf8");
            return version.trim();
        } catch (error) {
            return null;
        }
    }
}
