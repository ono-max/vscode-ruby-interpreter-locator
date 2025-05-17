export interface RubyInterpreterInfo {
    path: string;
    version?: string;
    gemHome?: string[];
    // alphabetical order
    isAsdf?: boolean;
    isChruby?: boolean;
    isPathEnvVar?: boolean;
    isRbenv?: boolean;
    isHomebrew?: boolean;
}
