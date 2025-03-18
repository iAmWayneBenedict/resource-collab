"use client";

import { TextGenerator } from "@/components/ui/text-generator";
import { useGetAISearchQuery } from "@/lib/queries/AISearch";
import { useAISearchStore } from "@/store/useAIResult";
import { Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Sparkle, Sparkles } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const AISearchResult = () => {
	const { query, reset } = useAISearchStore();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const queryClient = useQueryClient();

	const { data, isLoading, isPending, isFetching, isError, refetch } =
		useGetAISearchQuery({
			enabled: !!query,
			query,
		});

	useEffect(() => {
		if (query) refetch();
	}, [query]);

	useEffect(() => {
		if (data) {
			reset();
			queryClient.removeQueries({ queryKey: ["ai-search"] });
		}
	}, [searchParams, pathname]);

	if (!query) return null;

	if (isLoading || isFetching || isPending)
		return (
			<div className="mt-5 rounded-2xl bg-content1 px-5 py-4 shadow-md dark:border-small dark:border-default-200">
				<div className="flex gap-3">
					<Spinner size="sm" />
					<p className="text-sm italic text-default-500">
						AI analyzing resources...
					</p>
				</div>
			</div>
		);

	if (isError)
		return (
			<div className="mt-5 rounded-2xl bg-content1 px-5 py-4 text-red-500 shadow-md dark:border-small dark:border-default-200">
				<div className="flex gap-3">
					<AlertCircle size={20} />

					<p className="text-sm italic">Something went wrong</p>
				</div>
			</div>
		);

	return (
		<div className="mt-5 rounded-2xl bg-content1 px-5 py-4 shadow-md dark:border-small dark:border-default-200">
			{/* search query */}
			<div className="flex items-start justify-between">
				<p className="mb-2 flex items-center gap-2 italic text-default-500">
					<Sparkles size={16} />
					{query}
				</p>
				<div className="flex items-center gap-1 text-xs text-muted-foreground">
					<Sparkles className="h-3 w-3" />
					<span>Powered using RAG</span>
				</div>
			</div>
			{/* search result */}
			<TextGenerator text={data.data.summary} />
		</div>
	);
};

export default AISearchResult;
