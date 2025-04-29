import { FormData } from "@/types/forms";
import { Input } from "@heroui/react";
import React from "react";

interface AffiliationProps {
	data: FormData;
	errors?: Record<string, string>;
	onChange: (key: keyof FormData, value: any) => void;
}

export function Affiliation({ data, errors, onChange }: AffiliationProps) {
	return (
		<div className="flex flex-col gap-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Affiliation</h2>
				<p className="text-large text-default-500">
					Tell us about your organization
				</p>
			</div>
			<Input
				isRequired
				label="Company, School, or Organization"
				placeholder="Enter your affiliation"
				radius="sm"
				value={data.affiliation}
				variant="flat"
				isInvalid={!!errors?.affiliation}
				errorMessage={errors?.affiliation}
				classNames={{
					input: "bg-default-100",
					inputWrapper: "bg-default-100",
				}}
				onValueChange={(value) => onChange("affiliation", value)}
			/>
			<p className="text-small text-default-500">
				Please enter at least 3 characters
			</p>
		</div>
	);
}
