import React from "react";
import { Container } from "../_components";
import UserTable from "./_components/table";
import UserFormModal from "./_components/modal";

export default function Page() {
	return (
		<Container title={"Resources"} description={"asdasd"}>
			<UserTable />
			<UserFormModal />
		</Container>
	);
}
