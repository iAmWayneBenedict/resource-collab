import { Select, SelectItem, Spacer } from "@heroui/react";
import { Eye, Pencil } from "lucide-react";
import React, { Fragment } from "react";

const PERMISSION_LEVELS = [
	{
		label: "View only",
		value: "view",
		description: "(Can view but not edit)",
		icon: <Eye size={16} className="text-default-500" />,
	},
	{
		label: "Editor",
		value: "edit",
		description: "(Can edit and make changes)",
		icon: <Pencil size={16} className="text-default-500" />,
	},
];

type Props = {
	role: "view" | "edit";
	setRole: (role: "view" | "edit") => void;
	data: any;
	handleChange: (e: any) => void;
	disabled: boolean;
};

const PermissionLevel = ({
	role,
	setRole,
	data,
	handleChange,
	disabled,
}: Props) => {
	return (
		<Fragment>
			<Spacer />
			<Select
				label="Select permission level"
				labelPlacement="outside"
				value={role}
				onChange={(e) => {
					setRole(e.target.value as "view" | "edit");
					handleChange({ permission_level: e.target.value });
				}}
				className="w-full"
				defaultSelectedKeys={["view"]}
				aria-label="Select permission level"
				isDisabled={!!data?.restrictedTo || disabled}
				renderValue={(items) => {
					return items.map((item) => {
						const level = PERMISSION_LEVELS.find(
							(level) => level.value === item.key,
						);
						return (
							<div
								key={item.key}
								className="flex items-center gap-2"
							>
								{level?.icon}
								<span>{level?.label}</span>
								<span className="text-xs text-default-500">
									{level?.description}
								</span>
							</div>
						);
					});
				}}
			>
				{PERMISSION_LEVELS.map((level) => (
					<SelectItem
						key={level.value}
						textValue={`${level.label} ${level.description}`}
					>
						<div className="flex items-center gap-2">
							{level.icon}
							<span>{level.label}</span>
							<span className="text-xs text-default-500">
								{level.description}
							</span>
						</div>
					</SelectItem>
				))}
			</Select>
		</Fragment>
	);
};

export default PermissionLevel;
