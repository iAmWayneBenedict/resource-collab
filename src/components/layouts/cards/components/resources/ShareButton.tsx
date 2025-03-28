import config from "@/config";
import { usePostResourceShortUrlMutation } from "@/lib/mutations/short_urls";
import { useGetResourceShortUrl } from "@/lib/queries/short-urls";
import { useModal } from "@/store";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
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
				emails: data.data.emails.map((email: string) => ({
					email,
					permission: "view",
				})),
				url: data.data.short_url,
				restrictedTo,
				type: "Resource",
				loaded: true,
			};

			setShareData(formattedData);
			setEnableInitShortUrl(false);
			onOpenModal("share-modal", formattedData, undefined, name);
		},
		onError: () => {
			setEnableInitShortUrl(false);
		},
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
		onOpenModal("share-modal", { ...data, loaded: false }, undefined, name);
		setEnableInitShortUrl(true);
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
				emails: shortUrlData.emails.map((email: string) => ({
					email,
					permission: "view",
				})),
				type: "Resource",
				url: `${config.BASE_URL}/r/${shortUrlData.short_code}`,
				loaded: true,
			};

			onOpenModal("share-modal", formattedData, undefined, name);
			setEnableInitShortUrl(false);
		}
		if (shortUrlResponse.isError) {
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
			setEnableInitShortUrl(false);
		}
	}, [
		shortUrlResponse.data,
		shortUrlResponse.isSuccess,
		shortUrlResponse.isError,
	]);

	return (
		<button
			onClick={onClickShareHandler}
			className="flex items-center gap-1 p-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
		>
			<Share2 className="h-4 w-4" />
			<span>Share</span>
		</button>
	);
};

export default ShareButton;
