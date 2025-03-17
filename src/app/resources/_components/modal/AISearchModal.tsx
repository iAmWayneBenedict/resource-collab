"use client";

import { useDebounce } from "@/hooks";
import { useModal } from "@/store";
import {
	Modal,
	ModalContent,
	ModalBody,
	useDisclosure,
	Divider,
	Button,
	Textarea,
} from "@heroui/react";
import { ArrowUp, Sparkles } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ShinyText from "@/components/animations/ShinyText/ShinyText";
import { toggleScrollBody } from "@/lib/utils";
import { useAISearchStore } from "@/store/useAIResult";
import { useQueryClient } from "@tanstack/react-query";

// Define the suggestion buttons data
const primarySuggestions = [
	{ emoji: "🎨", text: "Tailwind CSS based UI components" },
	{ emoji: "✏️", text: "Capstone project title generator" },
	{ emoji: "🐘", text: "PostgreSQL Database providers" },
	{ emoji: "🔍", text: "Best state management libraries" },
];

const secondarySuggestions = [
	{ emoji: "🧪", text: "Testing frameworks for React" },
	{ emoji: "⚛️", text: "Most used UI library in React" },
	{ emoji: "🛠️", text: "Tools for capstone project" },
	{ emoji: "🔒", text: "Authentication solutions for React" },
	{ emoji: "📊", text: "Data visualization libraries" },
	{ emoji: "⚡", text: "Performance optimization techniques" },
	{ emoji: "🏗️", text: "Frameworks to use for capstone project" },
];
const AISearchModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [searchValue, setSearchValue] = useState("");
	const setQuery = useAISearchStore((state) => state.setQuery);
	const queryClient = useQueryClient();
	const searchRef = useRef<HTMLTextAreaElement>(null);

	const { name: modalName, onClose } = useModal();

	useEffect(() => {
		if (modalName === "AI Search") {
			onOpen();
			setTimeout(() => {
				searchRef.current?.focus();
			}, 500);
			toggleScrollBody(true);
		} else {
			onClose();
		}
	}, [modalName, onClose, onOpen]);

	const onCloseModal = () => {
		onOpenChange();
		onClose();
		toggleScrollBody(false);
	};

	const [showAllButtons, setShowAllButtons] = useState(false);

	const onButtonHover = () => {
		setShowAllButtons(true);
	};

	const onButtonLeave = () => {
		setShowAllButtons(false);
	};

	const onChangeHandler = (e: any) => {
		setSearchValue(e.target.value);
	};

	const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") onCloseModal();
		if (e.key === "Enter") {
			e.preventDefault();
			onSubmitHandler();
		}
	};

	const onSubmitHandler = () => {
		if (!searchValue)
			queryClient.removeQueries({ queryKey: ["ai-search"] });
		setQuery(searchValue);
		onCloseModal();
	};

	const onPressSuggestionHandler = (value: string) => {
		setSearchValue(value);
		setQuery(value);
		onCloseModal();
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			size="xl"
			hideCloseButton
		>
			<ModalContent>
				{() => (
					<ModalBody className="gap-3 rounded-2xl border border-default-200 p-0">
						<div
							className="relative p-2 pb-0"
							style={{ height: "auto" }}
						>
							<Textarea
								ref={searchRef}
								placeholder="✨ Ask AI about our resources..."
								variant="flat"
								minRows={2}
								maxRows={5}
								classNames={{
									base: "w-full",
									inputWrapper:
										"bg-transparent pr-4 rounded-xl border-0 focus-within:ring-0 group-data-[focus=true]:ring-0 group-data-[focus=true]:ring-offset-0 group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent shadow-none transition-colors",
									innerWrapper: "flex items-center",
									input: "bg-transparent custom-scrollbar",
								}}
								onChange={onChangeHandler}
								value={searchValue}
								onKeyDown={onKeyDownHandler}
								endContent={
									<div className="absolute top-1/2 flex -translate-y-1/2 items-center justify-center ~right-2/4">
										<AnimatePresence>
											{searchValue && (
												<motion.span
													initial={{
														opacity: 0,
														scale: 0.75,
													}}
													animate={{
														opacity: 1,
														scale: 1,
													}}
													exit={{
														opacity: 0,
														scale: 0.75,
													}}
													transition={{
														ease: "easeInOut",
														duration: 0.15,
													}}
												>
													<Button
														isIconOnly
														radius="full"
														color="primary"
														className="h-8 w-8 min-w-8 p-0"
														onPress={
															onSubmitHandler
														}
													>
														<ArrowUp
															strokeWidth={2}
															size={20}
														/>
													</Button>
												</motion.span>
											)}
										</AnimatePresence>
									</div>
								}
							/>
						</div>

						<Divider className="bg-default-200" />

						<div
							className="px-2"
							onMouseEnter={onButtonHover}
							onMouseLeave={onButtonLeave}
						>
							<motion.div
								key={"permanent"}
								className="flex flex-wrap gap-2"
							>
								{primarySuggestions.map((suggestion, index) => (
									<motion.div
										key={`primary-${index}`}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.3,
											delay: index * 0.1,
										}}
									>
										<Button
											variant="flat"
											size="sm"
											className="justify-start bg-default-100 text-default-700 transition-all hover:scale-105 hover:bg-default-100"
											onPress={() =>
												onPressSuggestionHandler(
													suggestion.text,
												)
											}
										>
											{suggestion.text}
										</Button>
									</motion.div>
								))}
							</motion.div>
							{/* Additional rows - visible on hover */}
							<AnimatePresence>
								{showAllButtons && (
									<motion.div
										key={"temporary"}
										className="mt-2 flex flex-wrap gap-2"
										initial={{
											opacity: 0,
											height: 0,
											overflow: "hidden",
										}}
										animate={{
											opacity: 1,
											height: "auto",
											overflow: "visible",
										}}
										exit={{
											opacity: 0,
											height: 0,
											overflow: "hidden",
										}}
										transition={{ duration: 0.3 }}
									>
										{secondarySuggestions.map(
											(suggestion, index) => (
												<motion.div
													key={`secondary-${index}`}
													initial={{
														opacity: 0,
														y: 10,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														duration: 0.3,
														delay:
															0.3 + index * 0.1,
													}}
												>
													<Button
														variant="flat"
														size="sm"
														className="justify-start bg-default-100 text-default-700 transition-all hover:scale-105 hover:bg-default-100"
														onPress={() =>
															onPressSuggestionHandler(
																suggestion.text,
															)
														}
													>
														{suggestion.text}
													</Button>
												</motion.div>
											),
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<div className="flex items-center justify-between p-4 pt-0">
							<div className="flex items-center">
								<div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-violet-500"></div>
								<div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-indigo-500 delay-75"></div>
								<div className="h-2 w-2 animate-pulse rounded-full bg-blue-500 delay-150"></div>
							</div>
							<div className="flex items-center gap-1 text-xs text-default-400">
								<Sparkles className="h-3 w-3" />

								<ShinyText text="Powered using RAG" />
							</div>
						</div>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
};

export default AISearchModal;
