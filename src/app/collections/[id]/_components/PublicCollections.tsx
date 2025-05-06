"use client";
import {
	FilterModalTrigger,
	SearchModalTrigger,
} from "@/app/resources/_components/filter";
import Section from "@/components/layouts/Section";
import { useGetPublicCollectionResourcesQuery } from "@/lib/queries/resources";
import { Avatar, Skeleton } from "@heroui/react";
import { useParams } from "next/navigation";
import React from "react";
import PublicResourceCardContainer from "./PublicResourcesCardWrapper";
import BannerGradient from "@/components/layouts/users/BannerGradient";

const PublicCollections = () => {
	const params = useParams();
	const publicCollectionResources = useGetPublicCollectionResourcesQuery({
		enabled: !!params.id,
		params: { id: params.id },
	});
	const { data, isLoading, isError } = publicCollectionResources;

	return (
		<div>
			<BannerGradient classNames="w-full h-[5rem] mb-12" />
			<div className="flex flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2">
					{isLoading ? (
						<>
							<Skeleton className="h-9 w-32 rounded-3xl" />
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5 rounded-full" />
								<Skeleton className="h-4 w-24 rounded-3xl" />
							</div>
						</>
					) : (
						<>
							<h1 className="text-3xl font-semibold">
								{data?.data.collection.name}
							</h1>
							<div className="flex items-center gap-2">
								{!isError && (
									<Avatar
										name={data?.data.collection.user.name}
										src={data?.data.collection.user.image}
										className="h-5 w-5"
										size="sm"
									/>
								)}
								<p className="text-xs text-zinc-600 dark:text-zinc-400">
									{data?.data.collection.user.email}
								</p>
							</div>
						</>
					)}
				</div>
				{!isLoading && (
					<div className="flex items-center justify-end gap-2">
						<SearchModalTrigger hideAiSearch={true} />
						<FilterModalTrigger />
					</div>
				)}
			</div>
			<Section className="mt-4 flex flex-col lg:flex-row">
				<div className="w-full">
					<PublicResourceCardContainer
						resourcesData={publicCollectionResources}
					/>
				</div>
			</Section>
		</div>
	);
};

export default PublicCollections;
