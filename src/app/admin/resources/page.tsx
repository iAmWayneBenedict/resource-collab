import React from "react";
import { Container } from "../_components";
import ResourcesTable from "./_components/table";
import ResourceFormModal from "./_components/modal";

export default function Page() {
	return (
		<Container title={"Resources"} description={"asdasd"}>
			<ResourcesTable />
			<ResourceFormModal />
		</Container>
	);
}
