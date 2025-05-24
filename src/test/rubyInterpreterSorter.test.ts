import { join } from "path";
import { RubyInterpreterSorter } from "../rubyInterpreterSorter";
import { getRubyInterpreterInfo } from "./utils";
import { existsSync, unlinkSync, writeFileSync } from "fs";

const projectRoot = join(__dirname, "..", "..");
const dotRubyVersionPath = join(projectRoot, ".ruby-version");
describe("RubyInterpreterSorter", () => {
    it("sorts interpreters by expected env manager priority", async () => {
        const sorter = await new RubyInterpreterSorter(
            Promise.resolve([
                getRubyInterpreterInfo({ isAsdf: true }),
                getRubyInterpreterInfo({ isChruby: true }),
                getRubyInterpreterInfo({ isHomebrew: true }),
                getRubyInterpreterInfo({ isRbenv: true }),
                getRubyInterpreterInfo({ isRvm: true }),
                getRubyInterpreterInfo({ isPathEnvVar: true }),
            ]),
            projectRoot,
        ).execute();
        expect(sorter[0].isRbenv).toBe(true);
        expect(sorter[1].isRvm).toBe(true);
        expect(sorter[2].isChruby).toBe(true);
        expect(sorter[3].isAsdf).toBe(true);
        expect(sorter[4].isHomebrew).toBe(true);
        expect(sorter[5].isPathEnvVar).toBe(true);
    });
    it("sorts interpreters by .ruby-version priority", async () => {
        try {
            writeFileSync(dotRubyVersionPath, "2.2.0");
            const sorter = await new RubyInterpreterSorter(
                Promise.resolve([
                    getRubyInterpreterInfo({ isRbenv: true, version: "3.0.0" }),
                    getRubyInterpreterInfo({ isRbenv: true, version: "3.2.0" }),
                    getRubyInterpreterInfo({ isRbenv: true, version: "2.2.0" }),
                    getRubyInterpreterInfo({ isRbenv: true, version: "2.7.0" }),
                ]),
                projectRoot,
            ).execute();
            expect(sorter[0].version).toBe("2.2.0");
        } finally {
            if (existsSync(dotRubyVersionPath)) {
                unlinkSync(dotRubyVersionPath);
            }
        }
    });
    it("sorts interpreters by version in descending order", async () => {
        const sorter = await new RubyInterpreterSorter(
            Promise.resolve([
                getRubyInterpreterInfo({ isRbenv: true, version: "3.0.0" }),
                getRubyInterpreterInfo({ isRbenv: true, version: "3.2.0" }),
                getRubyInterpreterInfo({ isRbenv: true, version: "2.2.0" }),
                getRubyInterpreterInfo({ isRbenv: true, version: "2.7.0" }),
            ]),
            projectRoot,
        ).execute();
        expect(sorter[0].version).toBe("3.2.0");
        expect(sorter[1].version).toBe("3.0.0");
        expect(sorter[2].version).toBe("2.7.0");
        expect(sorter[3].version).toBe("2.2.0");
    });
});
