export interface RubyInterpreterInfo {
    path: string;
    version?: string;
    // alphabetical order
    isAsdf?: boolean;
    isChruby?: boolean;
    isPathEnvVar?: boolean;
    isRbenv?: boolean;
    isHomebrew?: boolean;
}
