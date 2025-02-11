"use client";

import { useModal } from "@/store";
import { Button } from "@heroui/react";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const FilterModalTrigger = () => {
	const searchParams = useSearchParams();

	const { onOpen: onOpenModal } = useModal();

	const clickHandler = () => {
		onOpenModal("Resource Filter", null);
	};

	const selectedKeys = searchParams.get("filter")?.split(",") ?? [];
	const selectedKeysLength = selectedKeys.length;

	return (
		<div className="flex justify-end">
			<Button
				startContent={<Filter color="currentColor" size={20} />}
				radius="full"
				variant="ghost"
				color="primary"
				size="md"
				onPress={clickHandler}
			>
				Filters {selectedKeysLength ? `(${selectedKeysLength})` : null}
			</Button>
		</div>
	);
};

export default FilterModalTrigger;
