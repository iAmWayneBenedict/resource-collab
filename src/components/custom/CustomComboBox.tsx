import { useDebounce } from "@/hooks";
import {
	Button,
	Chip,
	Divider,
	Input,
	Listbox,
	ListboxItem,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Selection,
} from "@heroui/react";
import React, { memo, useMemo, useState } from "react";
import { cn, toggleScrollBody } from "../../lib/utils";
import { ListFilterPlus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const notButtonStyles = "rounded-xl bg-default-100 p-2";

type CustomComboBoxProps = {
	triggerText: string;
	options: string[];
	isButtonOnly?: boolean;
	value?: (string | number)[];
	onSelect?: (value: (string | number)[]) => void;
	isDisabled?: boolean;
	selectionMode?: "single" | "multiple";
	disableParentScrollOnOpen?: boolean;
	placement?:
		| "top"
		| "bottom"
		| "top-start"
		| "top-end"
		| "bottom-start"
		| "bottom-end";
};
const CustomComboBox = ({
	triggerText,
	options,
	isButtonOnly,
	value = [],
	selectionMode = "single",
	placement = "bottom",
	disableParentScrollOnOpen = true, // ! NOTE: Set "false" to enable scroll inside modals
	isDisabled = false,
	onSelect = () => {},
}: CustomComboBoxProps) => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(
		new Set([...value]),
	);
	const [searchValue, setSearchValue] = useState<string>("");

	// debounce search value
	const debouncedSearchValue = useDebounce(searchValue, 300);

	const onSelectionChangeHandler = (keys: Selection) => {
		setSelectedKeys(new Set(keys));
		onSelect([...keys].map((key) => key as string | number));
	};

	const onCloseChipHandler = (key: string) => {
		setSelectedKeys(new Set([...selectedKeys].filter((el) => el !== key)));
	};

	const onClickClearHandler = () => {
		setSelectedKeys(new Set([]));
	};

	const onOpenChangeHandler = (state: boolean) => {
		if (disableParentScrollOnOpen) toggleScrollBody(false);
	};

	return (
		<div
			className={cn(
				"relative flex w-full flex-col",
				!isButtonOnly && notButtonStyles,
			)}
		>
			<AnimatePresence mode="popLayout">
				{!isButtonOnly && !![...selectedKeys].length && (
					<motion.div
						layout
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ ease: "easeInOut", duration: 0.2 }}
						className="absolute right-3 top-3"
					>
						<Button
							size="sm"
							color="danger"
							variant="light"
							onPress={onClickClearHandler}
							isDisabled={isDisabled}
						>
							Clear
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			<Popover
				classNames={{ content: "p-0 w-full" }}
				aria-label="Custom ComboBox"
				placement={placement}
				onOpenChange={onOpenChangeHandler}
			>
				<PopoverTrigger>
					<Button
						isDisabled={isDisabled}
						variant="light"
						startContent={<ListFilterPlus />}
						className="w-fit bg-white hover:opacity-90"
					>
						{triggerText}{" "}
						<span className="font-bold text-violet">
							{[...selectedKeys].length
								? `(${[...selectedKeys].length})`
								: null}
						</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent aria-label="Custom Combobox Content">
					<Input
						autoFocus
						isClearable
						type="search"
						variant="bordered"
						placeholder="Search"
						value={searchValue}
						onValueChange={setSearchValue}
						className="my-1"
						startContent={
							<Search className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
						}
						classNames={{
							inputWrapper:
								"focus-within:ring-0 group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 group-data-[focus=true]:border-0 border-0 shadow-none bg-white",
						}}
					/>
					<Divider />
					<ListboxContainer
						options={options}
						searchValue={debouncedSearchValue}
						selectionMode={selectionMode}
						selectedKeys={selectedKeys}
						onSelectionChangeHandler={onSelectionChangeHandler}
					/>
					<Divider />
					<div className="flex w-full justify-end py-2 pr-2">
						<Button
							variant="flat"
							size="sm"
							className="h-6 min-w-10"
							radius="full"
							onPress={onClickClearHandler}
							isDisabled={![...selectedKeys].length}
						>
							Clear
						</Button>
					</div>
				</PopoverContent>
			</Popover>

			{!isButtonOnly && (
				<ChipsContainer
					isDisabled={isDisabled}
					selectedKeys={selectedKeys}
					onCloseChipHandler={onCloseChipHandler}
				/>
			)}
		</div>
	);
};

export default CustomComboBox;

type ListboxContainerProps = {
	options: string[];
	searchValue: string;
	selectionMode: "single" | "multiple";
	selectedKeys: Selection;
	onSelectionChangeHandler: (keys: Selection) => void;
};
const ListboxContainer = memo(
	({
		options,
		searchValue,
		selectedKeys,
		selectionMode,
		onSelectionChangeHandler,
	}: ListboxContainerProps) => {
		const filteredOptions = useMemo(() => {
			if (!searchValue) return options;
			return options.filter((option) =>
				option.toLowerCase().includes(searchValue.toLowerCase()),
			);
		}, [options, searchValue]);

		return (
			<Listbox
				selectedKeys={selectedKeys}
				onSelectionChange={onSelectionChangeHandler}
				selectionMode={selectionMode}
				isVirtualized
				aria-label="Custom ComboBox Listbox"
				classNames={{ emptyContent: "text-center" }}
				virtualization={{
					maxListboxHeight: 250,
					itemHeight: 40,
				}}
			>
				{filteredOptions.map((option) => (
					<ListboxItem key={option}>{option}</ListboxItem>
				))}
			</Listbox>
		);
	},
);

type ChipsContainerProps = {
	selectedKeys: Selection;
	isDisabled: boolean;
	onCloseChipHandler: (key: string) => void;
};
const ChipsContainer = ({
	selectedKeys,
	isDisabled,
	onCloseChipHandler,
}: ChipsContainerProps) => {
	const selectedKeysArr = [...selectedKeys];
	return (
		<div className="mb-1 mt-2 flex flex-wrap gap-1">
			<AnimatePresence mode="popLayout">
				{selectedKeysArr.length ? (
					selectedKeysArr.map((key) => (
						<motion.div
							key={key}
							layout
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ ease: "easeInOut", duration: 0.2 }}
						>
							<Chip
								variant="flat"
								isDisabled={isDisabled}
								onClose={() =>
									onCloseChipHandler(key as string)
								}
								classNames={{
									base: "bg-violet-100 text-violet-600 hover:bg-violet-200 hover:text-violet-700 focus:bg-violet-200 focus:text-violet-700",
								}}
							>
								{key}
							</Chip>
						</motion.div>
					))
				) : (
					<motion.div
						layout
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ ease: "easeInOut", duration: 0.2 }}
						className="w-full text-center text-sm text-gray-500"
					>
						No items selected.
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const generateItems = (n: number) => {
	const items = [
		"Cat",
		"Dog",
		"Elephant",
		"Lion",
		"Tiger",
		"Giraffe",
		"Dolphin",
		"Penguin",
		"Zebra",
		"Shark",
		"Whale",
		"Otter",
		"Crocodile",
	];

	const dataset = [];

	for (let i = 0; i < n; i++) {
		const item = items[i % items.length];

		dataset.push({
			label: `${item}${i}`,
			value: `${item.toLowerCase()}${i}`,
			description: "Sample description",
		});
	}

	return dataset.map((item) => item.label);
};
