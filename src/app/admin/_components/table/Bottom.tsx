import { useChecklist } from "@/store";
import { Pagination, Selection } from "@heroui/react";
import React, { useEffect } from "react";

type Props = {
	id: string;
	data: any[];
	page: number;
	setPage: (page: number) => void;
	total: number;
};

const Bottom = ({ id, data, page, setPage, total }: Props) => {
	const { getChecklistById } = useChecklist();

	return (
		<div className="flex justify-between items-center ">
			<span className="w-[30%] text-small text-default-400">
				{`${getChecklistById(id)?.list?.length || 0} of ${data?.length} selected`}
			</span>
			<Pagination
				isCompact
				showControls
				showShadow
				page={page}
				total={total}
				onChange={setPage}
			/>
		</div>
	);
};

export default Bottom;
// py-4 px-7 bg-white rounded-4xl shadow-md
