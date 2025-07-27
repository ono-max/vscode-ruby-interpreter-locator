import { RubyInterpreterInfo } from "./types";
import { promisify } from "util";
import { exec } from "child_process";
import { join } from "path";

// This function is exported for testing purposes.
export const asyncExec = promisify(exec);

interface RubyEnvJson {
    version: string;
    gemHome: string[];
}

export class RubyEnvScriptRunner {
    private rubyInterpreterInfoPromises: Promise<RubyInterpreterInfo[]>;
    constructor(rubyInterpreterInfoPromises: Promise<RubyInterpreterInfo[]>) {
        this.rubyInterpreterInfoPromises = rubyInterpreterInfoPromises;
    }

    public async execute(): Promise<RubyInterpreterInfo[]> {
        const rubyInterpreterInfos = await this.rubyInterpreterInfoPromises;
        return Promise.all(
            rubyInterpreterInfos.map(async (currentInfo) => {
                const result = await asyncExec(`${currentInfo.path} ${join(__dirname, "ruby_env.rb")}`);
                try {
                    const json: RubyEnvJson = JSON.parse(result.stdout);
                    currentInfo.version = json.version;
                    currentInfo.gemHome = json.gemHome;
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                }
                return currentInfo;
            }),
        );
    }
}
