import path from "path";
import { RubyInterpreterInfo } from "./types";

export class PathsReducer {
    private rubyInterpreterInfoPromises: Promise<RubyInterpreterInfo[]>[];
    constructor(rubyInterpreterInfoPromises: Promise<RubyInterpreterInfo[]>[]) {
        this.rubyInterpreterInfoPromises = rubyInterpreterInfoPromises;
    }
    public async execute(): Promise<RubyInterpreterInfo[]> {
        const interpreterInfoMap = new Map<string, RubyInterpreterInfo>();
        for (const promise of this.rubyInterpreterInfoPromises) {
            const rubyInterpreterInfos = await promise;
            for (const currentInfo of rubyInterpreterInfos) {
                const existingInfo = interpreterInfoMap.get(path.normalize(currentInfo.path));
                if (existingInfo === undefined) {
                    interpreterInfoMap.set(path.normalize(currentInfo.path), currentInfo);
                } else {
                    switch (true) {
                        // alphabetical order
                        case currentInfo.isAsdf:
                            existingInfo.isAsdf = true;
                            break;
                        case currentInfo.isChruby:
                            existingInfo.isChruby = true;
                            break;
                        case currentInfo.isHomebrew:
                            existingInfo.isHomebrew = true;
                            break;
                        case currentInfo.isPathEnvVar:
                            existingInfo.isPathEnvVar = true;
                            break;
                        case currentInfo.isRbenv:
                            existingInfo.isRbenv = true;
                            break;
                    }
                    interpreterInfoMap.set(existingInfo.path, existingInfo);
                }
            }
        }
        return Array.from(interpreterInfoMap.values());
    }
}
