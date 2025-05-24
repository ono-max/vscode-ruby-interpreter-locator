import { GlobalState, RubyInterpreterInfo } from "./types";

const key = "VSCODE_RUBY_INTERPRETER_LOCATOR_CACHE";

export class CacheManager<T> {
    private globalState: GlobalState;
    constructor(globalState: GlobalState) {
        this.globalState = globalState;
    }

    public getCache(): T | undefined {
        const value = this.globalState.get<{ cache: T; expiration: number }>(key);
        if (value && value.expiration > Date.now()) {
            return value.cache;
        }
    }

    public async setCache(cachePromises: Promise<T>): Promise<void> {
        const cache = await cachePromises;
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 1); // Set expiration to 1 day from now
        await this.globalState.update(key, { cache: cache, expiration: expiration.getTime() });
    }
}
