"use client";

import ResourceCard from "@/components/layouts/cards/ResourceCard";
import { ResourcesType } from "@/data/models/resources";
import { useGetPaginatedResourcesQuery } from "@/lib/queries/resources";
import { Button } from "@heroui/react";
import { RotateCcw } from "lucide-react";
import React from "react";

const ResourceCardContainer = () => {
	const { data, isSuccess, isLoading, refetch } =
		useGetPaginatedResourcesQuery({
			page: 1,
			limit: 20,
		});

	if (isLoading) {
		return (
			<div className="mt-10 flex w-full justify-center">
				<h3 className="text-xl">Loading...</h3>
			</div>
		);
	}

	if (!isSuccess) {
		return (
			<div className="mt-32 flex w-full flex-col items-center">
				<h3 className="text-xl">Something went wrong</h3>
				<div>
					<Button
						className="mt-4 bg-violet text-white hover:opacity-90"
						startContent={<RotateCcw size={20} />}
						onPress={refetch}
					>
						Reload
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mt-10 flex flex-wrap gap-6">
			{data?.data.rows.map((resource: any) => (
				<ResourceCard key={resource.id} data={resource} />
			))}
		</div>
	);
};

export default ResourceCardContainer;
