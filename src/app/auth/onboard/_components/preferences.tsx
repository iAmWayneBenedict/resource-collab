import { FormData } from "@/types/forms";
import { Button, Checkbox, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

interface PreferencesProps {
	data: FormData;
	errors?: Record<string, string>;
	onChange: (key: keyof FormData, value: any) => void;
}

const PROFESSIONS = [
	{
		icon: "lucide:code",
		label: "Software Developer",
		value: "software-developer",
	},
	{
		icon: "lucide:layout-template",
		label: "Frontend Developer",
		value: "frontend-developer",
	},
	{
		icon: "lucide:database",
		label: "Backend Developer",
		value: "backend-developer",
	},
	{
		icon: "lucide:git-branch",
		label: "DevOps Engineer",
		value: "devops-engineer",
	},
	{
		icon: "lucide:figma",
		label: "UI/UX Designer",
		value: "ui-ux-designer",
	},
	{
		icon: "lucide:briefcase",
		label: "Product Manager",
		value: "product-manager",
	},
	{
		icon: "lucide:graduation-cap",
		label: "Student",
		value: "student",
	},
	{
		icon: "lucide:plus",
		label: "Other",
		value: "other",
	},
];

export function Preferences({ data, errors, onChange }: PreferencesProps) {
	const showCustomInput = React.useMemo(() => {
		return data.selectedProfessions?.includes("other");
	}, [data.selectedProfessions]);

	const handleProfessionToggle = (value: string) => {
		const currentSelections = data.selectedProfessions || [];
		let newSelections;

		if (value === "other" && !currentSelections.includes("other")) {
			newSelections = ["other"];
			onChange("selectedProfessions", newSelections);
			return;
		}

		if (value !== "other" && currentSelections.includes("other")) {
			newSelections = [value];
			onChange("customProfession", ""); // Clear custom profession
			onChange("selectedProfessions", newSelections);
			return;
		}

		if (currentSelections.includes(value)) {
			newSelections = currentSelections.filter((item) => item !== value);
			if (value === "other") {
				onChange("customProfession", "");
			}
		} else {
			newSelections = [...currentSelections, value];
		}

		onChange("selectedProfessions", newSelections);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Professional Background</h2>
				<p className="text-large text-default-500">
					Select all that apply to you
				</p>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
				{PROFESSIONS.map(({ icon, label, value }) => {
					const isSelected =
						data.selectedProfessions?.includes(value);

					return (
						<Button
							key={value}
							className="h-auto min-h-[64px] w-full flex-col gap-2 p-3"
							color={isSelected ? "primary" : "default"}
							startContent={
								<Icon className="text-xl" icon={icon} />
							}
							variant={isSelected ? "solid" : "flat"}
							onPress={() => handleProfessionToggle(value)}
						>
							<span className="text-small">{label}</span>
						</Button>
					);
				})}
			</div>

			{showCustomInput && (
				<Input
					label="Your Profession"
					placeholder="Enter your profession"
					value={data.customProfession}
					variant="flat"
					isRequired
					isInvalid={!!errors?.customProfession}
					errorMessage={errors?.customProfession}
					description="Please enter at least 3 characters"
					onValueChange={(value) =>
						onChange("customProfession", value)
					}
				/>
			)}

			{errors?.selectedProfessions && (
				<p className="text-small text-danger">
					{errors.selectedProfessions}
				</p>
			)}

			<div className="pt-2">
				<Checkbox
					color="primary"
					isSelected={data.newsletter}
					size="md"
					onValueChange={(checked) => onChange("newsletter", checked)}
				>
					Subscribe to newsletter
				</Checkbox>
			</div>
		</div>
	);
}
