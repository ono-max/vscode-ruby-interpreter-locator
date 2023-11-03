import path from "path";
import { Kind, PathInfo } from "../locator/utils";
import { AsdfLocator } from "../locator/asdfLocator";

let rbenvRoot: string | undefined;

const projectRoot = path.join(__dirname, "..", "..");
const testData = path.join(projectRoot, "src", "test", "dummyDirectories", "asdftest", ".asdf");

beforeAll(() => {
    rbenvRoot = process.env.ASDF_DATA_DIR;
    process.env.ASDF_DATA_DIR = testData;
});

afterAll(() => {
    process.env.ASDF_DATA_DIR = rbenvRoot;
});

test("asdf", async () => {
    const asdfLocator = new AsdfLocator();
    const pathInfos = await asdfLocator.execute();
    const expected: PathInfo = {
        kind: Kind.Asdf,
        interpreterPaths: [
            path.join(testData, "installs", "ruby", "3.1.1", "bin", "ruby"),
            path.join(testData, "installs", "ruby", "3.2.2", "bin", "ruby"),
        ],
    };
    expect(pathInfos).toEqual(expected);
});
