import { Layers2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { collectionItemIcons } from "../../utils";

const CollectionFooter = ({
	data,
	onClickCardHandler,
}: {
	data: any;
	onClickCardHandler: () => void;
}) => {
	const accessLevelIcon =
		collectionItemIcons[
			data.access_level as keyof typeof collectionItemIcons
		];

	return (
		<div
			className="absolute bottom-0 left-0 z-[2] flex w-full"
			onClick={onClickCardHandler}
		>
			<div className="flex flex-1 items-end justify-between gap-2 px-5 pb-4">
				{/* title */}
				<div className="flex flex-col gap-2">
					<span className="ml-1 text-default-200 ~text-sm/xs dark:text-default-700">
						{data.resourceCount}
					</span>
					<div className="flex items-center gap-2">
						<span className="text-default-200 dark:text-default-700">
							<Layers2 size={16} />
						</span>
						<h3 className="line-clamp-1 text-default-200 ~text-sm/xs dark:text-default-700 lg:~text-base/sm">
							{data.name}
						</h3>
					</div>
				</div>
				<div className="flex flex-col items-center gap-2">
					<span className="mb-1 text-default-200 dark:text-default-700">
						{accessLevelIcon}
					</span>
				</div>
			</div>
		</div>
	);
};

export default CollectionFooter;
