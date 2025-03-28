export const useClientRouter = (indexes: number[], w: any) => {
	"use client";
	const pathname = w.location.pathname as string;
	return pathname
		.slice(1)
		.split("/")
		.filter((_, index) => indexes.includes(index));
};
