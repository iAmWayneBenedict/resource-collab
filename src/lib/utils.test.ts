import { describe, it, expect, vi } from "vitest";
import { cn, reInitQueryParams, toJson, toStr } from "@/lib/utils";

describe("Utility functions", () => {
	it("cn should combine class names correctly", () => {
		expect(cn("class1", false, "class3")).toBe("class1 class3");

		const result = cn("bg-red-500", "text-white", "p-4", "bg-blue-400");
		expect(result).toBe("text-white p-4 bg-blue-400");
	});

	it("toJson should convert data to JSON correctly", () => {
		const data = { key: "value" };
		expect(toJson(data)).toEqual(data);
	});

	it("toJson should handle circular references by throwing an error", () => {
		const circularObj: any = {};
		circularObj.self = circularObj;
		expect(() => toJson(circularObj)).toThrow(TypeError);
	});

	it("toStr should convert various data types to string format", () => {
		const number = 123;
		const string = "test";
		const boolean = true;
		const object = { key: "value" };
		const array = [1, 2, 3];

		expect(toStr(number)).toBe("123");
		expect(toStr(string)).toBe('"test"');
		expect(toStr(boolean)).toBe("true");
		expect(toStr(object)).toBe('{"key":"value"}');
		expect(toStr(array)).toBe("[1,2,3]");
	});

	it('toStr should return "null" when data is null', () => {
		const result = toStr(null);
		expect(result).toBe("null");
	});

	it("should reinitialize query params", () => {
		const BASE_URL = "http://localhost:8080";

		const url = BASE_URL + "?test=123&test2=456";
		const searchParams = reInitQueryParams(url, {
			test3: "789",
			test: "012",
		});
		const params = new URLSearchParams(searchParams);
		console.log(params.toString());
		// expect(new URLSearchParams(searchParams)?.get("test").toBe("123"));
		// expect(searchParams?.get("test2")).toBe("456");
	});
});
