import { Chip } from "@heroui/react";

type ResourceTagsProps = {
	tags: Array<{ tag: { name: string } }>;
};

export const ResourceTags = ({ tags }: ResourceTagsProps) => {
	return (
		<div className="flex flex-wrap gap-2">
			{tags?.slice(0, 3).map(({ tag }) => (
				<Chip variant="flat" key={tag.name} className="text-sm">
					{tag.name}
				</Chip>
			))}
			{tags?.length > 3 && (
				<Chip variant="flat" className="text-sm">
					+{tags.length - 3}
				</Chip>
			)}
		</div>
	);
};
