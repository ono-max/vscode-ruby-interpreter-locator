import path from "path";
import { Kind, PathInfo } from "../locator/utils";
import { HomebrewLocator } from "../locator/homebrewLocator";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";

let rbenvRoot: string | undefined;

const projectRoot = path.join(__dirname, "..", "..");
const testData = path.join(projectRoot, "src", "test", "dummyDirectories", "homebrewtest", "homebrew");

beforeAll(() => {
    rbenvRoot = process.env.HOMEBREW_PREFIX;
    process.env.HOMEBREW_PREFIX = testData;
});

afterAll(() => {
    process.env.HOMEBREW_PREFIX = rbenvRoot;
});

test("homebrew", async () => {
    const homebrewLocator = new HomebrewLocator();
    const pathInfos = await homebrewLocator.execute();
    const expected: RubyInterpreterInfo[] = [
        {
            isHomebrew: true,
            path: path.join(testData, "Cellar", "ruby", "3.2.2_1", "bin", "ruby"),
        },
    ];
    expect(pathInfos).toEqual(expected);
});
