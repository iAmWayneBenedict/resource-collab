// Helper function to highlight matching text
export const HighlightedText = ({
	text,
	highlight,
}: {
	text: string;
	highlight: string;
}) => {
	if (!highlight.trim()) return <>{text}</>;
	const regex = new RegExp(`(${highlight})`, "gi");
	const parts = text.split(regex);

	return (
		<>
			{parts.map((part, i) =>
				regex.test(part) ? (
					<span
						key={i}
						className="font-bold text-violet underline decoration-2 group-hover:text-white group-hover:decoration-white group-focus:text-white group-focus:decoration-white"
					>
						{part}
					</span>
				) : (
					<span
						key={i}
						className="group-hover:text-white group-focus:text-white"
					>
						{part}
					</span>
				),
			)}
		</>
	);
};
