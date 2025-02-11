"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Bottom, CustomTable, Top } from "../../../_components/table";
import { columns } from "./helper";
import Row from "./Row";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
} from "@heroui/react";
import { useSortTable } from "@/store/useSort";
import { ChevronDown, Plus, Search, Trash } from "lucide-react";
import { useDebounce } from "@/hooks";
import { useChecklist, useModal } from "@/store";
import { useGetPaginatedUsersQuery } from "@/services/api/queries/user";

const UserTable = () => {
	const [searchValue, setSearchValue] = useState("");
	const [roleFilter, setRoleFilter] = useState(new Set([""]));
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const { sort } = useSortTable();
	const onOpen = useModal((state) => state.onOpen);

	const debouncedSearchValue = useDebounce(searchValue, 500);
	const { getChecklistById } = useChecklist();

	const hasCheckedInList = getChecklistById("User")?.list?.length || 0 > 0;

	const { data, isLoading, refetch, isRefetching } = useGetPaginatedUsersQuery({
		limit: rowsPerPage,
		page: page,
		sort_by: sort.column,
		sort_type: sort.direction,
		filter_by: [...roleFilter][0],
		search: debouncedSearchValue,
	});

	useEffect(() => {
		refetch();
	}, [sort, page, rowsPerPage, debouncedSearchValue, roleFilter, refetch]);

	useEffect(() => {
		if (data) setTotalPages(Math.ceil(data?.data?.count / rowsPerPage));
	}, [data, isLoading]);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowsPerPage(Number(e.target.value));
		setPage(1);
	}, []);
	return (
		<div>
			<div className="flex justify-between gap-3 items-end mb-5">
				<div className="flex gap-3 flex-1">
					<Input
						isClearable
						className="w-full sm:max-w-[30%]"
						classNames={{
							inputWrapper:
								"bg-white data-[hover=true]:bg-white/90 group-data-[focus=true]:bg-white/90 shadow-md",
						}}
						placeholder="Search by name..."
						startContent={<Search />}
						value={searchValue}
						onClear={() => setSearchValue("")}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
					<Dropdown>
						<DropdownTrigger className="hidden sm:flex">
							<Button
								endContent={<ChevronDown className="text-small" />}
								variant="flat"
								className="capitalize"
							>
								{[...roleFilter][0] ? [...roleFilter].join("") : "Roles"}
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label="Table Roles"
							closeOnSelect={true}
							selectedKeys={roleFilter}
							selectionMode="single"
							onSelectionChange={(keys) => {
								const hasSelected = [...keys][0];
								if (hasSelected) {
									setRoleFilter(new Set(keys as unknown as any[]));
								} else {
									setRoleFilter(new Set([""]));
								}
							}}
						>
							{["admin", "user", "guest"].map((column) => (
								<DropdownItem key={column} className="capitalize">
									{column}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
				<div className="flex gap-3">
					<Button
						variant="light"
						color={hasCheckedInList ? "danger" : "default"}
						isDisabled={!hasCheckedInList}
						endContent={<Trash className="w-5 h-5" />}
					>
						Delete
					</Button>
					<Button
						color="primary"
						onPress={() => onOpen("userForm", null)}
						className="bg-violet"
						endContent={<Plus className="w-7 h-7" />}
					>
						Add New
					</Button>
				</div>
			</div>
			<CustomTable
				containerProps={{
					title: "User",
					columns: columns,
					rows: Array.isArray(data?.data?.rows) ? data.data.rows : [],
				}}
				bodyProps={{ RowComponent: Row, isLoading: isRefetching || isLoading }}
				bottomComponent={
					<Bottom
						id="User"
						data={data?.data?.rows || []}
						page={page}
						setPage={setPage}
						total={totalPages}
					/>
				}
				topComponent={
					<Top data={data?.data?.count || 0} onRowsPerPageChange={onRowsPerPageChange} />
				}
			/>
		</div>
	);
};

export default UserTable;
