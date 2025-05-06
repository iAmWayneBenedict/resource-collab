"use client";

import { useAuthUser, useModal } from "@/store";
import { Button, Kbd, Tooltip } from "@heroui/react";
import { Search, Sparkles } from "lucide-react";
import React from "react";
import "./styles.css";
import { useMediaQuery } from "react-responsive";

const SearchModalTrigger = ({ hideAiSearch }: { hideAiSearch?: boolean }) => {
	const { onOpen: onOpenModal } = useModal();
	const { authUser } = useAuthUser();
	const isSmallDevices = useMediaQuery({
		query: "(max-width: 64rem)",
	});

	const clickSearchHandler = () => {
		onOpenModal("Search Filter", null);
	};

	const clickAISearchHandler = () => {
		if (!authUser) {
			onOpenModal("auth-modal", null);
			return;
		}
		onOpenModal("AI Search", null);
	};

	return (
		<div className="flex items-center gap-2">
			<Tooltip
				content={
					<div className="flex items-center gap-2 px-2 py-1">
						<span className="text-sm">Search</span>
						<div className="flex items-center gap-1">
							<Kbd className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-800">
								CTRL
							</Kbd>
							<span className="text-xs">+</span>
							<Kbd className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-800">
								K
							</Kbd>
						</div>
					</div>
				}
				showArrow
				classNames={{
					arrow: "bg-background",
				}}
			>
				<Button isIconOnly variant="light" onPress={clickSearchHandler}>
					<Search />
				</Button>
			</Tooltip>
			{!hideAiSearch && (
				<Button
					disableRipple
					onPress={clickAISearchHandler}
					radius="full"
					className="hover:gradient-animation data-[hover=true]:gradient-animation transform bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-bold text-white transition duration-500 ease-in-out md:px-4 md:py-2"
				>
					<span
						suppressHydrationWarning
						className="flex items-center gap-2"
					>
						<Sparkles />
						{!isSmallDevices ? "Try AI Search" : "AI Search"}
					</span>
				</Button>
			)}
		</div>
	);
};

export default SearchModalTrigger;

export const AISearchIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		viewBox="-5.0 -10.0 110.0 135.0"
	>
		<path
			d="m57.305 4.9688c-0.082032-0.48047-0.77734-0.48047-0.85938 0-0.63281 3.6289-3.4727 6.4688-7.1016 7.1016-0.48047 0.082032-0.48047 0.77734 0 0.85938 3.6289 0.63281 6.4688 3.4727 7.1016 7.1016 0.082032 0.48047 0.77734 0.48047 0.85938 0 0.63281-3.6289 3.4727-6.4688 7.1016-7.1016 0.48047-0.082032 0.48047-0.77734 0-0.85938-3.6289-0.63281-6.4688-3.4727-7.1016-7.1016zm17.824 13.102c-0.14844-0.84375-1.3594-0.84375-1.5078 0-1.1055 6.3477-6.0781 11.32-12.426 12.426-0.84375 0.14844-0.84375 1.3594 0 1.5078 6.3477 1.1055 11.32 6.0781 12.426 12.426 0.14844 0.84375 1.3594 0.84375 1.5078 0 1.1055-6.3477 6.0781-11.32 12.426-12.426 0.84375-0.14844 0.84375-1.3594 0-1.5078-6.3477-1.1055-11.32-6.0781-12.426-12.426zm-25.754 12.555c-14.152 0-25.625 11.473-25.625 25.625s11.473 25.625 25.625 25.625 25.625-11.473 25.625-25.625c0-1.0352 0.83984-1.875 1.875-1.875s1.875 0.83984 1.875 1.875c0 7.4375-2.7617 14.227-7.3203 19.402l13.02 13.023c0.73438 0.73047 0.73438 1.918 0 2.6484-0.73047 0.73438-1.918 0.73438-2.6484 0l-13.023-13.02c-5.1758 4.5586-11.965 7.3203-19.402 7.3203-16.223 0-29.375-13.152-29.375-29.375s13.152-29.375 29.375-29.375c1.0352 0 1.875 0.83984 1.875 1.875s-0.83984 1.875-1.875 1.875z"
			fill-rule="evenodd"
		/>
	</svg>
);
