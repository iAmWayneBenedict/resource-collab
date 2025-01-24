import React from "react";
import { Container } from "../_components";
import UserTable from "./_components/table";
import UserFormModal from "./_components/modal";

export default function Users() {
	return (
		<Container title={"Users"} description={"asdasd"}>
			<UserTable />
			<UserFormModal />
		</Container>
	);
}
