import { afterEach, describe, expect, it, vi } from "vitest";
import fetchJSON from "./fetchJSON.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchJSON", () => {
  it("returns parsed JSON from a successful response", async () => {
    const emoji = { dog: "🐶" };
    const json = vi.fn().mockResolvedValue(emoji);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "application/json; charset=utf-8" },
        json,
      }),
    );

    await expect(fetchJSON("/emoji.json")).resolves.toEqual(emoji);
    expect(fetch).toHaveBeenCalledWith("/emoji.json");
    expect(json).toHaveBeenCalledOnce();
  });

  it("rejects when the response is not successful", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(fetchJSON("/missing.json")).rejects.toThrow(
      "Could not load emoji data (404)",
    );
  });

  it("rejects when the response is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "text/plain" },
      }),
    );

    await expect(fetchJSON("/emoji.txt")).rejects.toThrow(
      new TypeError("this is not json!"),
    );
  });
});
