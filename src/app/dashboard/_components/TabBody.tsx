import CollectionCard from "@/components/layouts/cards/CollectionCard";
import React from "react";
import ResourceTab from "./ResourceTab";

type Props = {
	tab: "resources" | "liked" | "collections" | "shared" | "portfolios";
};
const TabBody = ({ tab }: Props) => {
	console.log(tab);
	return (
		// <div className="flex flex-wrap gap-4">
		// 	{/* <CollectionCard />
		// 	<CollectionCard />
		// 	<CollectionCard />
		// 	<CollectionCard /> */}
		// </div>
		<>{tab !== "portfolios" && <ResourceTab type={tab} />}</>
	);
};

export default TabBody;
