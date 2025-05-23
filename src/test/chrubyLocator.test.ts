import path from "path";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";
import { RvmLocator } from "../locator/rvmLocator";
import { ChrubyLocator } from "../locator/chrubyLocator";
import { getRubyInterpreterInfo } from "./utils";

let homedir: string | undefined;

const projectRoot = path.join(__dirname, "..", "..");
const testData = path.join(projectRoot, "src", "test", "dummyDirectories", "chrubytest", ".rubies");

beforeAll(() => {
    homedir = process.env.HOME;
    process.env.HOME = testData;
});

afterAll(() => {
    process.env.RBENV_ROOT = homedir;
});

test("chruby", async () => {
    // Mock getRootDir to always return testData
    jest.spyOn(ChrubyLocator.prototype as any, "getRootDir").mockReturnValue([testData]);

    const locator = new ChrubyLocator();
    const pathInfos = await locator.execute();
    const expected: RubyInterpreterInfo[] = [
        getRubyInterpreterInfo({ isChruby: true, path: path.join(testData, "ruby-3.3.8", "bin", "ruby") }),
        getRubyInterpreterInfo({ isChruby: true, path: path.join(testData, "ruby-3.4.3", "bin", "ruby") }),
    ];

    expect(pathInfos).toEqual(expected);
});
