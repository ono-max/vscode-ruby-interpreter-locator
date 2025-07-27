import path from "path";
import { RubyInterpreterInfo } from "../types";
import { RvmLocator } from "../locator/rvmLocator";
import { getRubyInterpreterInfo } from "./utils";

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

test("rvm", async () => {
    const locator = new RvmLocator();
    const pathInfos = await locator.execute();
    const expected: RubyInterpreterInfo[] = [
        getRubyInterpreterInfo({
            isRvm: true,
            path: path.join(testData, ".rvm", "rubies", "ruby-3.3.8", "bin", "ruby"),
        }),
        getRubyInterpreterInfo({
            isRvm: true,
            path: path.join(testData, ".rvm", "rubies", "ruby-3.4.3", "bin", "ruby"),
        }),
    ];
    expect(pathInfos).toEqual(expected);
});
