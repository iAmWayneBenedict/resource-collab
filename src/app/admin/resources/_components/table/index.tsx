"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Bottom, CustomTable, Top } from "../../../_components/table";
import { columns } from "./helper";
import Row from "./Row";
import { Button, Input } from "@heroui/react";
import { useSortTable } from "@/store/useSort";
import { Plus, Search, Trash } from "lucide-react";
import { useDebounce } from "@/hooks";
import { useChecklist, useModal } from "@/store";
import { useGetPaginatedResourcesQuery } from "@/lib/queries/resources";

const ResourcesTable = () => {
	const [searchValue, setSearchValue] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const { sort } = useSortTable();
	const { onOpen: onOpenModal } = useModal();

	const debouncedSearchValue = useDebounce(searchValue, 500);
	const { getChecklistById } = useChecklist();

	const hasCheckedInList = getChecklistById("User")?.list?.length || 0 > 0;

	const { data, isLoading, refetch, isRefetching } =
		useGetPaginatedResourcesQuery({
			limit: rowsPerPage,
			page: page,
			sort_by: sort.column,
			sort_type: sort.direction,
			search: debouncedSearchValue,
		});

	useEffect(() => {
		refetch();
	}, [sort, page, rowsPerPage, debouncedSearchValue, refetch]);

	useEffect(() => {
		if (data) setTotalPages(Math.ceil(data?.data?.count / rowsPerPage));
	}, [data, isLoading]);

	const onRowsPerPageChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[],
	);
	return (
		<div>
			<div className="mb-5 flex items-end justify-between gap-3">
				<div className="flex flex-1 gap-3">
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
				</div>
				<div className="flex gap-3">
					<Button
						variant="light"
						color={hasCheckedInList ? "danger" : "default"}
						isDisabled={!hasCheckedInList}
						endContent={<Trash className="h-5 w-5" />}
					>
						Delete
					</Button>
					<Button
						color="primary"
						onPress={() => onOpenModal("resourcesForm", null)}
						className="bg-violet"
						endContent={<Plus className="h-7 w-7" />}
					>
						Add New
					</Button>
				</div>
			</div>
			<CustomTable
				containerProps={{
					title: "Resources",
					columns: columns,
					rows: Array.isArray(data?.data?.rows) ? data.data.rows : [],
				}}
				bodyProps={{
					RowComponent: Row,
					isLoading: isRefetching || isLoading,
				}}
				bottomComponent={
					<Bottom
						id="Resources"
						data={data?.data?.rows || []}
						page={page}
						setPage={setPage}
						total={totalPages}
					/>
				}
				topComponent={
					<Top
						data={data?.data?.count || 0}
						onRowsPerPageChange={onRowsPerPageChange}
					/>
				}
			/>
		</div>
	);
};

export default ResourcesTable;
