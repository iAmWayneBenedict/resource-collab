"use client";

import {
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Divider,
} from "@heroui/react";
import { Button } from "@heroui/react";
import type { Selection } from "@heroui/react";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { reInitQueryParams, toggleScrollBody } from "@/lib/utils";
import { useLenis } from "@studio-freight/react-lenis";

const ControlledMultipleChipFilter = () => {
	const searchParams = useSearchParams();

	// State to hold the selected keys
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
	const lenis = useLenis(() => {});
	const router = useRouter();

	// Memoize the filter query
	const filterQuery = useMemo(() => {
		return [...selectedKeys].join(",");
	}, [selectedKeys]);

	// When the component mounts, set the selected keys based on the query parameters
	useLayoutEffect(() => {
		const searchFilterValues = searchParams.get("filter")?.split(",") ?? [];
		setSelectedKeys(new Set(searchFilterValues));
	}, [searchParams]);

	// When the selected keys change, update the query parameters
	useEffect(() => {
		router.push(reInitQueryParams(window.location.href, { filter: filterQuery }), {
			scroll: false,
		});
	}, [filterQuery, router]);

	// Function to handle closing a chip
	const handleCloseChip = (key: string) =>
		setSelectedKeys(new Set([...selectedKeys].filter((el) => el !== key)));

	// Function to handle chip selection
	const handleSelect = (keys: Selection) => {
		setSelectedKeys(keys);
	};

	const handleClear = () => {
		setSelectedKeys(new Set([]));
	};

	return (
		<div
			id="filter-container"
			className="flex-col sm:flex-row flex justify-end items-end sm:items-center gap-4 h-fit"
		>
			<div
				id="filter-chip-container"
				className="order-2 sm:order-1 flex justify-end gap-2 flex-wrap"
			>
				{[...selectedKeys].map((key) => (
					<Chip
						key={key}
						variant="solid"
						className="capitalize"
						onClose={() => handleCloseChip(key as string)}
					>
						{key}
					</Chip>
				))}
			</div>
			{[...selectedKeys].length > 0 && (
				<Divider
					orientation="vertical"
					className="dark:bg-white bg-black hidden h-[1rem] sm:flex order-4 sm:order-2"
				/>
			)}
			<div id="filter-selector" className="order-1 sm:order-3 flex items-center gap-2">
				{[...selectedKeys].length > 0 && (
					<Button
						className="capitalize underline"
						variant="light"
						color="primary"
						radius="full"
						onPress={handleClear}
					>
						Clear
					</Button>
				)}
				<Dropdown onOpenChange={toggleScrollBody} placement="bottom-end">
					<DropdownTrigger>
						<Button
							className="capitalize"
							variant="ghost"
							color="primary"
							radius="full"
							size="md"
							startContent={<Filter color="currentColor" size={20} />}
						>
							Tags
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Multiple selection example"
						closeOnSelect={false}
						selectedKeys={selectedKeys}
						selectionMode="multiple"
						variant="flat"
						onSelectionChange={handleSelect}
						classNames={{
							base: "max-h-[15rem] overflow-y-auto",
						}}
					>
						<DropdownItem key="text">Text</DropdownItem>
						<DropdownItem key="number">Number</DropdownItem>
						<DropdownItem key="date">Date</DropdownItem>
						<DropdownItem key="single date">Single Date</DropdownItem>
						<DropdownItem key="iteration">Iteration</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
};

export default ControlledMultipleChipFilter;
