import React from "react";
import { Container } from "../_components";
import ResourcesTable from "./_components/table";
import ResourceFormModal from "../../../components/modal/ResourceFormModal";

export default function Page() {
	return (
		<Container title={"Resources"} description={"asdasd"}>
			<ResourcesTable />
			<ResourceFormModal />
		</Container>
	);
}
