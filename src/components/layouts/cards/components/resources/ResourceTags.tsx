import { Chip } from "@heroui/react";

export const ResourceTags = ({ tags }: { tags: string[] }) => {
	return (
		<div className="flex flex-wrap gap-2">
			{tags?.slice(0, 3).map((tag: string) => (
				<Chip variant="flat" key={tag} className="text-xs 2xl:text-sm">
					{tag}
				</Chip>
			))}
			{tags?.length > 3 && (
				<Chip variant="flat" className="text-xs 2xl:text-sm">
					+{tags.length - 3}
				</Chip>
			)}
		</div>
	);
};
