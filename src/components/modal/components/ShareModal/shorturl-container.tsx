import { cn } from "@/lib/utils";
import { Button, Spinner, Tooltip } from "@heroui/react";
import { CheckCheck, Copy, Link } from "lucide-react";
import React from "react";

type Props = {
	copied: boolean;
	role: "view" | "edit";
	shareType: "public" | "private";
	data: any;
	isLoadingShortUrl: boolean;
	handleCopyUrl: () => void;
};

const ShortUrlContainer = ({
	copied,
	role,
	shareType,
	data,
	isLoadingShortUrl,
	handleCopyUrl,
}: Props) => {
	return (
		<div className="mb-4">
			<p className="mb-2 text-sm text-default-600">
				{shareType === "public"
					? `Anyone with the link can ${role === "view" ? "view" : "edit"} this resource.`
					: `Share ${role === "view" ? "read-only" : "editable"} enrollment link to enroll an audience in this resource.`}
			</p>
			<div className="flex items-center gap-2 rounded-full bg-default-100 p-2">
				<Link size={16} className="ml-2 text-default-500" />
				<span
					className={cn(
						"flex-1 truncate text-sm",
						isLoadingShortUrl && "select-none opacity-50",
					)}
				>
					{data?.url}
				</span>
				<Tooltip
					content={"Resource link copied!"}
					placement="top"
					isOpen={copied}
					showArrow
				>
					<Button
						size="sm"
						variant="flat"
						radius="full"
						onPress={handleCopyUrl}
						isIconOnly={isLoadingShortUrl}
						isDisabled={isLoadingShortUrl || !data?.url}
					>
						{isLoadingShortUrl ? (
							<Spinner size="sm" />
						) : copied ? (
							<>
								<CheckCheck size={16} />
								<span>Copied</span>
							</>
						) : (
							<>
								<Copy size={16} />
								<span>Copy</span>
							</>
						)}
					</Button>
				</Tooltip>
			</div>
		</div>
	);
};

export default ShortUrlContainer;
