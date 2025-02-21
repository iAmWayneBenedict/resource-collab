import React from "react";

type Props = {
	data: number;
	onRowsPerPageChange: (event: any) => void;
};

const Top = ({ data, onRowsPerPageChange }: Props) => {
	return (
		<div className="flex items-center justify-between">
			<span className="text-small text-default-400">
				Total {data} rows
			</span>
			<label className="flex items-center text-small text-default-400">
				Rows per page:
				<select
					className="bg-transparent text-small text-default-400 outline-none"
					onChange={onRowsPerPageChange}
				>
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="15">15</option>
				</select>
			</label>
		</div>
	);
};

export default Top;
