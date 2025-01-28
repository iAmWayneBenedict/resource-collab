import React from "react";

type Props = {
	data: number;
	onRowsPerPageChange: (event: any) => void;
};

const Top = ({ data, onRowsPerPageChange }: Props) => {
	return (
		<div className="flex justify-between items-center">
			<span className="text-default-400 text-small">Total {data} rows</span>
			<label className="flex items-center text-default-400 text-small">
				Rows per page:
				<select
					className="bg-transparent outline-none text-default-400 text-small"
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
