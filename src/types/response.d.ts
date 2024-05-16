type TErrorAPIResponse = {
	data: null[] | string[] | TDataFormAPIResponse | Record<string, any> | null;
	status: number;
	message: string;
};

type TSuccessAPIResponse<TData> = {
	data: TData;
	status: number;
	message: string;
};

// if the response is from a form, it will have a path property
// inside the path property, there will be an array of strings
// each string will be the name of a field in the form
type TDataFormAPIResponse = {
	path: string[];
};
