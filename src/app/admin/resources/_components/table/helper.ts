import { ChipProps } from "@heroui/react";

export const columns = [
	{ name: "ID", id: "id", sortable: true },
	{ name: "NAME", id: "name", sortable: true },
	{ name: "EMAIL", id: "email", sortable: true },
	{ name: "ROLE", id: "role", sortable: true },
	{ name: "CREATED", id: "created_at", sortable: true },
	{ name: "UPDATED", id: "updated_at", sortable: true },
	{ name: "ACTIONS", id: "actions" },
];

export const statusOptions = [
	{ name: "Active", id: "active" },
	{ name: "Paused", id: "paused" },
	{ name: "Vacation", id: "vacation" },
];

export const roleColorMap: Record<string, ChipProps["color"]> = {
	admin: "warning",
	user: "success",
	guest: "default",
};

export type TUser = (typeof users)[0];

export const users = [
	{
		id: 1,
		name: "Tony Reichert",
		role: "CEO",
		team: "Management",
		status: "active",
		age: "29",
		avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
		email: "tony.reichert@example.com",
	},
];
