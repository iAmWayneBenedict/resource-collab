"use client";

import { useGetPaginatedUsersQuery } from "@/services/api/queries/user/user";
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
import { ChevronDown, Plus, Search } from "lucide-react";
import { useDebounce } from "@/hooks";

const UserTable = () => {
	const [searchValue, setSearchValue] = useState("");
	const [roleFilter, setRoleFilter] = useState(new Set([""]));
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const { sort } = useSortTable();

	const debouncedSearchValue = useDebounce(searchValue, 500);

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
	}, [sort, page, rowsPerPage, debouncedSearchValue, roleFilter]);

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
				<div className="flex gap-3">
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
							closeOnSelect={false}
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
					<Button color="primary" endContent={<Plus />}>
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
