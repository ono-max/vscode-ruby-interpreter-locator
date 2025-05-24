import path from "path";
import { RbenvLocator } from "../locator/rbenvLocator";
import { Kind, PathInfo } from "../locator/utils";
import { RubyInterpreterInfo } from "../types";
import { getRubyInterpreterInfo } from "./utils";

let rbenvRoot: string | undefined;

const projectRoot = path.join(__dirname, "..", "..");
const testData = path.join(projectRoot, "src", "test", "dummyDirectories", "rbenvtest", ".rbenv");

beforeAll(() => {
    rbenvRoot = process.env.RBENV_ROOT;
    process.env.RBENV_ROOT = testData;
});

afterAll(() => {
    process.env.RBENV_ROOT = rbenvRoot;
});

test("rbenv", async () => {
    const rbenvLocator = new RbenvLocator();
    const pathInfos = await rbenvLocator.execute();
    const expected: RubyInterpreterInfo[] = [
        getRubyInterpreterInfo({ isRbenv: true, path: path.join(testData, "versions", "2.7.1", "bin", "ruby") }),
        getRubyInterpreterInfo({ isRbenv: true, path: path.join(testData, "versions", "3.1.4", "bin", "ruby") }),
    ];
    expect(pathInfos).toEqual(expected);
});
