import { useTabletOrSmallerScreen } from "@/hooks/useMediaQueries";
import { cn } from "@/lib/utils";
import { Radio, RadioGroup } from "@heroui/react";
import { Globe, Lock } from "lucide-react";
import React from "react";

const ACCESS_LEVELS = [
	{
		name: "Invite Only",
		value: "private",
		description: "Only invited people can access",
		icon: <Lock size={16} />,
	},
	{
		name: "Public",
		value: "public",
		description: "Anyone with the link can access",
		icon: <Globe size={16} />,
	},
];

type Props = {
	shareType: "private" | "public";
	data: any;
	setShareType: (shareType: "private" | "public") => void;
};

const AccessLevel = ({ shareType, data, setShareType }: Props) => {
	const isSmallDevices = useTabletOrSmallerScreen();
	return (
		<RadioGroup
			value={shareType}
			onValueChange={setShareType as any}
			orientation={isSmallDevices ? "vertical" : "horizontal"}
			classNames={{
				wrapper: "flex gap-3",
			}}
			isDisabled={!!data?.restrictedTo}
		>
			{ACCESS_LEVELS.map((level) => (
				<Radio
					key={level.value}
					value={level.value}
					classNames={{
						base: cn(
							"m-0 inline-flex items-center justify-between bg-content1 hover:bg-content2",
							"max-w-full flex-1 cursor-pointer flex-row-reverse gap-4 rounded-lg border-1 border-default-200 px-2 py-3",
							"rounded-xl data-[selected=true]:border-primary",
						),
					}}
				>
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
							{level.icon}
						</div>
						<div>
							<p className="text-sm font-medium">{level.name}</p>
							<p className="text-xs text-default-500">
								{level.description}
							</p>
						</div>
					</div>
				</Radio>
			))}
		</RadioGroup>
	);
};

export default AccessLevel;
