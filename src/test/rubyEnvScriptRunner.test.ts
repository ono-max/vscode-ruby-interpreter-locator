import * as runner from "../rubyEnvScriptRunner";
import { RubyInterpreterInfo } from "../rubyInterpreterInfo";
import * as path from "path";

describe("RubyEnvScriptRunner", () => {
    it("should return correct Ruby version and gemHome from asyncExec output", async () => {
        jest.spyOn(runner, "asyncExec").mockResolvedValue({
            stdout: JSON.stringify({
                version: "3.0.0",
                gemHome: ["/home/user/.gem/ruby/3.0.0"],
            }),
            stderr: "",
        });

        const rubyEnvScriptRunner = new runner.RubyEnvScriptRunner(
            Promise.resolve([
                {
                    path: "ruby",
                    isAsdf: true,
                },
            ] as RubyInterpreterInfo[]),
        );

        const result = await rubyEnvScriptRunner.execute();
        expect(result[0].version).toEqual("3.0.0");
        expect(result[0].gemHome).toEqual(["/home/user/.gem/ruby/3.0.0"]);
    });
});
