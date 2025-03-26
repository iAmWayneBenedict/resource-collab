import { usePostLikeResourceMutation } from "@/lib/mutations/like";
import { useAuthUser, useModal } from "@/store";
import { ResourcePaginatedSearchParamsState } from "@/store/context/providers/ResourcePaginatedSearchParams";
import useResourcePaginatedSearchParams from "@/store/context/useResourcePaginatedSearchParams";
import { addToast, Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ChartNoAxesColumn, Heart, Share2 } from "lucide-react";
import { usePostResourceShortUrlMutation } from "../../../../../lib/mutations/short_urls";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGetResourceShortUrl } from "@/lib/queries/short-urls";
import config from "@/config";

type ResourceMetricsProps = {
	id: number;
	url: string;
	name: string;
	views: number;
	shares: number;
	likes?: number;
	isLiked?: boolean;
};

// Move helper functions outside component
const formatNumber = (num: number): string => {
	if (num >= 1000) return (num / 1000).toFixed(1) + "k";
	return num.toString();
};

// Define type for the resource data
type ResourceData = {
	id: number;
	likesCount: number;
	likes: Array<{ id: number }>;
	[key: string]: any;
};

// Define type for the previous resources data structure
type PreviousResourcesData = {
	data: {
		rows: ResourceData[];
	};
	[key: string]: any;
};

export const ResourceMetrics = ({
	id,
	url,
	name,
	views,
	shares,
	likes = 0,
	isLiked = false,
}: ResourceMetricsProps) => {
	const queryClient = useQueryClient();
	const searchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) => state.searchParams,
	) as ResourcePaginatedSearchParamsState["searchParams"];
	const pathname = usePathname();
	const onOpenModal = useModal((state) => state.onOpen);
	const setSubmitCallback = useModal((state) => state.setSubmitCallback);
	const [shareData, setShareData] = useState<Record<string, any> | null>(
		null,
	);
	const [enabledInitShortUrl, setEnableInitShortUrl] =
		useState<boolean>(false);
	const { authUser } = useAuthUser();

	const restrictedTo = pathname === "/resources" ? "public" : null;

	const resourceShortUrlMutation = usePostResourceShortUrlMutation({
		params: id,
		onSuccess: (data) => {
			// console.log(data);
			setShareData({
				id: data.data.id,
				url: data.data.short_url,
				restrictedTo,
				type: "Resource",
			});
			onOpenModal(
				"share-resource",
				{
					id: data.data.id,
					url: data.data.short_url,
					restrictedTo,
					type: "Resource",
				},
				undefined,
				name,
			);
		},
		onError: () => {},
	});

	const onSubmitShare = (data: any) => {
		const req = {
			...data,
			full_path: url,
		};
		resourceShortUrlMutation.mutate(req);
	};

	const onClickShareHandler = () => {
		const data = shareData ?? {
			url: null,
			restrictedTo,
			type: "Resource",
		};
		setEnableInitShortUrl(true);
		onOpenModal("share-resource", data, undefined, name);
		setSubmitCallback(onSubmitShare);
	};

	const shortUrlResponse = useGetResourceShortUrl({
		enabled: enabledInitShortUrl,
		resourceId: id,
	});

	useEffect(() => {
		if (shortUrlResponse.isSuccess) {
			onOpenModal(
				"share-resource",
				{
					...shortUrlResponse.data.data,
					emails: shortUrlResponse.data.data.emails.length
						? shortUrlResponse.data.data.emails.join(",")
						: "",
					type: "Resource",
					url:
						config.BASE_URL +
						"/r/" +
						shortUrlResponse.data.data.short_code,
				},
				undefined,
				name,
			);
		}
	}, [shortUrlResponse.data, shortUrlResponse.isSuccess]);

	// Create query key array for better reusability
	const getQueryKey = () => searchParams.queryKey;

	const mutation = usePostLikeResourceMutation({
		onMutate: async () => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: getQueryKey(),
			});

			// Get current data from cache
			const previousResources = queryClient.getQueryData(
				getQueryKey(),
			) as PreviousResourcesData;

			if (previousResources) {
				queryClient.setQueryData(getQueryKey(), {
					...previousResources,
					data: {
						...previousResources.data,
						rows: previousResources.data.rows.map((resource) => {
							if (resource.id === id) {
								const likesCount = isLiked
									? resource.likesCount - 1
									: resource.likesCount + 1;
								const likes = isLiked
									? []
									: [...resource.likes, { id: id }];
								return {
									...resource,
									likesCount,
									likes,
								};
							}
							return resource;
						}),
					},
				});
			}

			// Return rollback function
			return () => {
				queryClient.setQueryData(getQueryKey(), previousResources);
			};
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["paginated-resources"],
			});
			queryClient.invalidateQueries({
				queryKey: searchParams.queryKey,
			});
		},
		onError: (_, __, rollback: any) => {
			if (rollback) rollback();

			addToast({
				title: "Error",
				description: "Something went wrong",
				color: "danger",
			});
		},
	});

	const onLike = () => {
		if (!authUser) {
			onOpenModal("auth-modal", {});
			return;
		}

		mutation.mutate({
			id: id,
		});
	};

	return (
		<div className="flex items-center">
			<button
				onClick={onLike}
				className="flex items-center gap-1 p-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
			>
				<Heart
					fill={isLiked ? "#ef4444" : "none"}
					className={`${isLiked ? "h-5 w-5 text-red-500" : "h-4 w-4"} transition-all duration-300`}
				/>
				<span className="transition-all duration-300">
					{formatNumber(likes)} likes
				</span>
			</button>
			<button className="flex items-center gap-1 p-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
				<ChartNoAxesColumn className="h-4 w-4" />
				<span>{formatNumber(views)} views</span>
			</button>

			<button
				onClick={onClickShareHandler}
				className="flex items-center gap-1 p-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
			>
				<Share2 className="h-4 w-4" />
				<span>Share</span>
			</button>
		</div>
	);
};
