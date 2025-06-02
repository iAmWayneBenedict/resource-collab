import config from "@/config";
import { usePostResourceShortUrlMutation } from "@/lib/mutations/short_urls";
import { useGetResourceShortUrl } from "@/lib/queries/short-urls";
import { useModal } from "@/store";
import { useDashboardPage } from "@/store/useDashboardPage";
import { useSelectedCollection } from "@/store/useSelectedCollection";
import { Share2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ShareButton = ({
	id,
	name,
	url,
}: {
	id: number;
	name: string;
	url: string;
}) => {
	const pathname = usePathname();
	const onOpenModal = useModal((state) => state.onOpen);
	const setSubmitCallback = useModal((state) => state.setSubmitCallback);
	const { isOpen } = useModal();
	const getDashboardPage = useDashboardPage(
		(state) => state.getDashboardPage,
	);
	const isSharedPage =
		getDashboardPage() === "shared" || getDashboardPage() === "public";
	const [shareData, setShareData] = useState<Record<string, any> | null>(
		null,
	);
	const [enabledInitShortUrl, setEnableInitShortUrl] =
		useState<boolean>(false);

	const restrictedTo = pathname === "/resources" ? "public" : null;

	const resourceShortUrlMutation = usePostResourceShortUrlMutation({
		params: id,
		onSuccess: (data) => {
			const formattedData = {
				...data.data,
				shared_to: data.data.emails.map((email: string) => ({
					email,
					permission: "view",
				})),
				url: data.data.short_url,
				restrictedTo,
				type: "Resource",
				loaded: true,
			};

			setShareData(formattedData);
			onOpenModal("share-modal", formattedData, undefined, name);
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
		if (isSharedPage) return;

		const data = shareData ?? {
			url: null,
			type: "Resource",
		};
		onOpenModal(
			"share-modal",
			{
				...data,
				restrictedTo,
				loaded: enabledInitShortUrl,
			},
			undefined,
			name,
		);
		if (!data?.restrictedTo) {
			setEnableInitShortUrl(true);
			shortUrlResponse.refetch();
		}
		setSubmitCallback(onSubmitShare);
	};

	const shortUrlResponse = useGetResourceShortUrl({
		enabled: enabledInitShortUrl,
		resourceId: id,
	});

	useEffect(() => {
		if (shortUrlResponse.isSuccess) {
			const shortUrlData = shortUrlResponse.data.data;
			const formattedData = {
				...shortUrlData,
				shared_to: shortUrlData.emails.map((email: string) => ({
					email,
					permission: "view",
				})),
				type: "Resource",
				url: `${config.BASE_URL}/r/${shortUrlData.short_code}`,
				loaded: true,
				restrictedTo,
				access_level:
					(shortUrlData.access_level ?? shortUrlData.emails.length)
						? "private"
						: "public",
			};

			isOpen &&
				onOpenModal("share-modal", formattedData, undefined, name);
		}
		if (shortUrlResponse.isError) {
			isOpen &&
				onOpenModal(
					"share-modal",
					{
						url: null,
						restrictedTo,
						type: "Resource",
						loaded: true,
					},
					undefined,
					name,
				);
		}
	}, [
		shortUrlResponse.data,
		shortUrlResponse.isSuccess,
		shortUrlResponse.isError,
		shortUrlResponse.isFetching,
	]);

	return (
		<button
			onClick={onClickShareHandler}
			disabled={isSharedPage}
			className={`flex items-center gap-1 p-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 ${isSharedPage ? "cursor-not-allowed opacity-70 hover:text-zinc-700 dark:hover:text-zinc-200" : ""}`}
		>
			<Share2 className="h-4 w-4" />
			<span>Share</span>
		</button>
	);
};

export default ShareButton;
