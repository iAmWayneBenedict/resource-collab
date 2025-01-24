import React, { useLayoutEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Selection,
	SortDescriptor,
} from "@heroui/react";
import { useChecklist } from "@/store";
import { useSortTable } from "@/store/useSort";
import Spinner from "@/components/ui/spinner";

type TColumn = {
	[key: string]: any;
};

type TContainerProps = {
	title: string;
	columns: TColumn[];
	rows: any[];
};

type TBodyProps = {
	RowComponent: React.ElementType;
	isLoading?: boolean;
};

type THeaderProps = {};

type Props = {
	containerProps: TContainerProps;
	headerProps?: THeaderProps;
	bodyProps: TBodyProps;
	topComponent: React.ReactNode;
	bottomComponent: React.ReactNode;
};

const CustomTable = ({
	containerProps: { title, columns, rows },
	headerProps,
	bodyProps: { RowComponent, isLoading },
	bottomComponent,
	topComponent,
}: Props) => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

	const { updateChecklist, isExists, addChecklist } = useChecklist();
	const { sort, setSort } = useSortTable();

	useLayoutEffect(() => {
		if (!isExists(title)) addChecklist(title, []);
	}, []);

	return (
		<Table
			isHeaderSticky
			aria-label="Table"
			bottomContent={bottomComponent}
			bottomContentPlacement="outside"
			selectedKeys={selectedKeys}
			selectionMode="multiple"
			sortDescriptor={sort}
			topContent={topComponent}
			topContentPlacement="outside"
			onSelectionChange={(keys) => {
				setSelectedKeys(keys);
				updateChecklist(title, [...keys]);
			}}
			onSortChange={(sortDescriptor) => {
				setSort(sortDescriptor);
			}}
			classNames={{ wrapper: "min-h-96" }}
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn
						key={column.id}
						align={column.id === "actions" ? "center" : "start"}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				emptyContent={`No ${title?.toLowerCase()} found`}
				loadingContent={<Spinner className="w-[30px] h-[30px]">Retrieving data...</Spinner>}
				items={rows}
				isLoading={isLoading}
			>
				{(row) => (
					<TableRow key={row.id}>
						{(columnKey) => (
							<TableCell>
								<RowComponent row={row} columnKey={columnKey} />
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default CustomTable;
