import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { useQuery } from "@tanstack/react-query";
import { useGetLoggedUserQuery } from "@/services/api/queries/user";
import ApiMethods from "@/services/api/ApiMethods";
import ENDPOINTS from "@/services/api/EndPoints";
import { NextResponse } from "next/server";

// Mock useQuery
vi.mock("@tanstack/react-query", () => ({
	useQuery: vi.fn(),
}));

// Mock ApiMethods and get
vi.mock("@/services/ApiMethods", async (importOriginal) => {
	const ApiMethods = {
		get: vi.fn(),
	};

	return {
		...importOriginal, // preserve the original exports
		default: ApiMethods, // add the default export
	};
});

describe("useGetLoggedUserQuery", () => {
	// Clear mock functions after each test
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should call useQuery with the correct parameters", () => {
		const mockResponse = {
			message: "Success",
			status: 200,
			data: { id: 1, name: "Test User" },
		};

		vi.mocked(ApiMethods.get).mockResolvedValue(mockResponse);

		vi.mocked(useQuery).mockImplementation(({ queryKey, queryFn }) => {
			expect(queryKey).toEqual(["logged-user"]);
			// @ts-ignore
			const result = queryFn(); // make sure that the queryFn is called
			expect(result).resolves.toEqual(mockResponse);
			return { data: null, isLoading: false } as unknown as ReturnType<typeof useQuery>; // Mock useQuery return
		});

		// triggers the hook and mocks
		renderHook(() => useGetLoggedUserQuery());

		expect(useQuery).toHaveBeenCalledOnce();
		expect(useQuery).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: ["logged-user"],
				queryFn: expect.any(Function),
				retry: 1,
			})
		);
		expect(ApiMethods.get).toHaveBeenCalledWith(ENDPOINTS.VERIFY_LOGGED_USER());
	});

	it("should handle successful API response", async () => {
		const mockResponse = {
			message: "Success",
			status: 200,
			data: { id: 1, name: "Test User" },
		};

		vi.mocked(ApiMethods.get).mockResolvedValue(mockResponse);

		vi.mocked(useQuery).mockImplementation(({ queryKey, queryFn }) => {
			expect(queryKey).toEqual(["logged-user"]);
			// @ts-ignore
			const result = queryFn(); // make sure that the queryFn is called
			expect(result).resolves.toEqual(mockResponse);

			return {
				data: mockResponse,
				isLoading: false,
				isError: false,
			} as unknown as ReturnType<typeof useQuery>; // Mock useQuery return
		});

		const { result } = renderHook(() => useGetLoggedUserQuery());

		expect(ApiMethods.get).toHaveBeenCalledWith(ENDPOINTS.VERIFY_LOGGED_USER());
		expect(result.current.data).toEqual(mockResponse);
		expect(result.current.isLoading).toBe(false);
	});

	it("should handle API error response", async () => {
		const responseError = NextResponse.json({ data: null, message: "Error" }, { status: 500 });

		vi.mocked(ApiMethods.get).mockRejectedValue(responseError);

		vi.mocked(useQuery).mockImplementation(({ queryKey, queryFn }) => {
			expect(queryKey).toEqual(["logged-user"]);
			// @ts-ignore
			const result = queryFn(); // make sure that the queryFn is called
			expect(result).rejects.toEqual(responseError);

			return {
				data: responseError,
				isLoading: false,
				isError: true,
			} as unknown as ReturnType<typeof useQuery>; // Mock useQuery return
		});

		const { result } = renderHook(() => useGetLoggedUserQuery());

		expect(ApiMethods.get).toHaveBeenCalledWith(ENDPOINTS.VERIFY_LOGGED_USER());
		expect(result.current.data).toEqual(responseError);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(true);
	});

	it("should retry the query once when it fails", async () => {
		vi.mocked(useQuery).mockImplementation(({ retry }) => {
			expect(retry).toBe(1); // Ensure retry is set to 1
			return { data: null, isLoading: true, isError: false } as unknown as ReturnType<
				typeof useQuery
			>;
		});

		renderHook(() => useGetLoggedUserQuery());
		expect(useQuery).toHaveBeenCalledTimes(1);
	});
});
