"use client";
import Aside from "@/components/layouts/users/Aside";
import { useGetCategoriesQuery } from "@/lib/queries/categories";
import { Skeleton } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";

const CategoriesAsideContainer = () => {
	const { data, isLoading, isError, error, refetch } =
		useGetCategoriesQuery();
	const searchParams = useSearchParams();

	useEffect(() => {
		refetch();
	}, [searchParams]);

	if (isLoading) {
		return (
			<div className="hidden min-w-[15rem] flex-col gap-2 pr-10 lg:flex 2xl:min-w-[18rem] 2xl:pr-16">
				<div className="mb-5 border-b border-neutral-400 pb-5">
					<Skeleton className="rounded-full">
						<div className="h-14 rounded-full bg-default-300" />
					</Skeleton>
				</div>
				<Skeleton className="rounded-full">
					<div className="h-14 rounded-full bg-default-300" />
				</Skeleton>
				<Skeleton className="rounded-full">
					<div className="h-14 rounded-full bg-default-300" />
				</Skeleton>
				<Skeleton className="rounded-full">
					<div className="h-14 rounded-full bg-default-300" />
				</Skeleton>
				<Skeleton className="rounded-full">
					<div className="h-14 rounded-full bg-default-300" />
				</Skeleton>
			</div>
		);
	}
	if (isError) {
		return (
			<aside className="mr-4 min-w-[15rem] rounded-lg border bg-red-50 p-4 pr-10 shadow-sm 2xl:min-w-[18rem] 2xl:pr-16">
				<div className="flex items-center space-x-2 text-red-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-6 w-6"
					>
						<path
							fillRule="evenodd"
							d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
							clipRule="evenodd"
						/>
					</svg>
					<div>
						<p className="font-semibold">
							Failed to load categories
						</p>
						<p className="text-sm text-red-500">
							{error?.message || "Please try again later"}
						</p>
					</div>
				</div>
			</aside>
		);
	}

	let links: any[] = [];

	if (data) {
		const tempLinks = [{ id: "all", title: "All", href: "/resources" }];
		data.data.rows.forEach((row: any) => {
			tempLinks.push({
				id: row.id,
				title: row.name,
				href: `/resources?category=${row.id}`,
			});
		});

		links = tempLinks;
	}

	return <Aside links={links} />;
};

export default CategoriesAsideContainer;
