type TErrorAPIResponse = {
	data: null[] | string[] | Record<string, any> | null;
	status: number;
	message: string;
};

type TResponse<TData> = {
	data: TData;
	status: number;
	message: string;
};
