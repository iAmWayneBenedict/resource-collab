"use client";

import { useModal } from "@/store";
import { Badge, Button } from "@heroui/react";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const FilterModalTrigger = ({ iconOnly }: { iconOnly?: boolean }) => {
	const searchParams = useSearchParams();

	const { onOpen: onOpenModal } = useModal();

	const clickHandler = () => {
		onOpenModal("Resource Filter", null);
	};

	const selectedKeys = [
		searchParams.get("category"),
		searchParams.get("tags"),
		searchParams.get("sortBy"),
	].filter(Boolean);
	const selectedKeysLength = selectedKeys.length;

	return (
		<div className="flex justify-end">
			{!iconOnly ? (
				<Button
					startContent={<Filter color="currentColor" size={20} />}
					radius="full"
					variant="ghost"
					color="primary"
					size="md"
					onPress={clickHandler}
				>
					Filters{" "}
					{selectedKeysLength ? `(${selectedKeysLength})` : null}
				</Button>
			) : (
				<Badge content={selectedKeysLength}>
					<Button
						radius="full"
						variant="light"
						color="primary"
						size="md"
						isIconOnly
						onPress={clickHandler}
					>
						<Filter color="currentColor" size={20} />
					</Button>
				</Badge>
			)}
		</div>
	);
};

export default FilterModalTrigger;
