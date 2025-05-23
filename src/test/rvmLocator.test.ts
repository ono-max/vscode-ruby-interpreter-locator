import path from "path";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";
import { RvmLocator } from "../locator/rvmLocator";

let homedir: string | undefined;

const projectRoot = path.join(__dirname, "..", "..");
const testData = path.join(projectRoot, "src", "test", "dummyDirectories", "rvmtest");

beforeAll(() => {
    homedir = process.env.HOME;
    process.env.HOME = testData;
});

afterAll(() => {
    process.env.RBENV_ROOT = homedir;
});

test("rbenv", async () => {
    const rvmLocator = new RvmLocator();
    const pathInfos = await rvmLocator.execute();
    const expected: RubyInterpreterInfo[] = [
        {
            isAsdf: false,
            isChruby: false,
            isPathEnvVar: false,
            isRbenv: false,
            isRvm: true,
            isHomebrew: false,
            path: path.join(testData, ".rvm", "rubies", "ruby-3.3.8", "bin", "ruby"),
        },
        {
            isAsdf: false,
            isChruby: false,
            isPathEnvVar: false,
            isRbenv: false,
            isRvm: true,
            isHomebrew: false,
            path: path.join(testData, ".rvm", "rubies", "ruby-3.4.3", "bin", "ruby"),
        },
    ];
    expect(pathInfos).toEqual(expected);
});
