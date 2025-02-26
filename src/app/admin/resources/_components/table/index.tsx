"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Bottom, CustomTable, Top } from "../../../_components/table";
import { columns } from "./helper";
import Row from "./Row";
import { addToast, Button, Input } from "@heroui/react";
import { useSortTable } from "@/store/useSort";
import { Plus, Search, Trash } from "lucide-react";
import { useDebounce } from "@/hooks";
import { useAlertDialog, useChecklist, useModal } from "@/store";
import { useGetPaginatedResourcesQuery } from "@/lib/queries/resources";
import { useDeleteResourceMutation } from "@/lib/mutations/resources";

const ResourcesTable = () => {
	const setAlertDialogDetails = useAlertDialog(
		(state) => state.setAlertDialogDetails,
	);

	const [searchValue, setSearchValue] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const { sort } = useSortTable();
	const { onOpen: onOpenModal } = useModal();

	const debouncedSearchValue = useDebounce(searchValue, 500);
	const { getChecklistById, updateChecklist } = useChecklist();

	const hasCheckedInList = getChecklistById("Resources")?.list?.length ?? 0;

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

	const deleteResourcesMutation = useDeleteResourceMutation({
		onSuccess: () => {
			// refetch the data
			refetch();
			// reset the checklist
			updateChecklist("Resources", []);

			// add toast
			addToast({
				title: "Resources deleted",
				description: "Resources have been deleted successfully",
				color: "success",
			});
		},
		onError: (error) => {
			console.log(error);
			addToast({
				title: "Error deleting resources",
				description: "Something went wrong while deleting resources",
				color: "danger",
			});
		},
	});

	const onPressDeleteHandler = () => {
		if (!getChecklistById("Resources")?.list?.length) {
			addToast({
				title: "No resources selected",
				description: "Please select resources to delete",
				color: "danger",
			});
			return;
		}

		setAlertDialogDetails({
			isOpen: true,
			title: "Delete Resources",
			type: "danger",
			message: "Are you sure you want to delete these resources?",
			dialogType: "confirm",
			onConfirm: () => {
				deleteResourcesMutation.mutate({
					ids: getChecklistById("Resources")?.list || [],
					type: "hard",
				});
			},
		});
	};

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
						spellCheck="false"
						suppressHydrationWarning
					/>
				</div>
				<div className="flex gap-3">
					<Button
						variant="light"
						color={hasCheckedInList ? "danger" : "default"}
						isDisabled={!hasCheckedInList}
						endContent={<Trash className="h-5 w-5" />}
						onPress={onPressDeleteHandler}
					>
						Delete
					</Button>
					<Button
						color="primary"
						onPress={() =>
							onOpenModal("resourcesForm", { type: "url" })
						}
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
