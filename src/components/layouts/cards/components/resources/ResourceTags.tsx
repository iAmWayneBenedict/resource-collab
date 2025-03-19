import { Chip } from "@heroui/react";
import { useRef, useState, useEffect, useLayoutEffect } from "react";

export const ResourceTags = ({ tags }: { tags: string[] }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [visibleTags, setVisibleTags] = useState<string[]>([]);
	const [hiddenCount, setHiddenCount] = useState(0);

	useLayoutEffect(() => {
		if (!containerRef.current || !tags?.length) return;

		const calculateVisibleTags = () => {
			const container = containerRef.current;
			if (!container) return;

			// Reset to show all tags initially
			container.style.visibility = "hidden";
			setVisibleTags(tags);

			// Wait for next render cycle
			setTimeout(() => {
				if (!container) return;

				const containerWidth = container.offsetWidth;
				let currentWidth = 0;
				let visibleCount = 0;
				const tagElements = Array.from(container.children);

				// Reserve space for the "+n" chip
				const plusChipWidth = 10; // Approximate width for the "+n" chip
				const availableWidth =
					containerWidth - (tags.length > 1 ? plusChipWidth : 0);

				for (let i = 0; i < tagElements.length; i++) {
					const tagWidth =
						tagElements[i].getBoundingClientRect().width;

					if (currentWidth + tagWidth <= availableWidth) {
						currentWidth += tagWidth + 8; // 8px for gap
						visibleCount++;
					} else {
						break;
					}
				}

				// If we can show all tags, don't reserve space for "+n"
				if (visibleCount === tags.length) {
					setVisibleTags(tags);
					setHiddenCount(0);
				} else {
					// Ensure we show at least one tag
					visibleCount = Math.max(1, visibleCount - 1);
					setVisibleTags(tags.slice(0, visibleCount));
					setHiddenCount(tags.length - visibleCount);
				}

				container.style.visibility = "visible";
			}, 0);
		};

		calculateVisibleTags();
		window.addEventListener("resize", calculateVisibleTags);

		return () => {
			window.removeEventListener("resize", calculateVisibleTags);
		};
	}, [tags]);

	if (!tags?.length) return null;

	return (
		<div
			ref={containerRef}
			className="flex flex-nowrap gap-2 overflow-hidden"
		>
			{visibleTags.map((tag: string) => (
				<Chip
					variant="flat"
					key={tag}
					className="whitespace-nowrap text-xs 2xl:text-sm"
				>
					{tag}
				</Chip>
			))}
			{hiddenCount > 0 && (
				<Chip
					variant="flat"
					className="whitespace-nowrap text-xs 2xl:text-sm"
				>
					+{hiddenCount}
				</Chip>
			)}
		</div>
	);
};
