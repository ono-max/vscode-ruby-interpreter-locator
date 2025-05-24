import { RubyInterpreterInfo } from "../types";

export function getRubyInterpreterInfo(custom: Partial<RubyInterpreterInfo>): RubyInterpreterInfo {
    return {
        isAsdf: false,
        isChruby: false,
        isPathEnvVar: false,
        isRbenv: false,
        isRvm: false,
        isHomebrew: false,
        path: "/usr/bin/ruby",
        ...custom,
    };
}
