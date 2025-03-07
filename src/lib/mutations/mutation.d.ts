type TMutationOptions = {
	params?: any;
	onSuccess?: (data: any) => void;
	onError?: (...error) => void;
	onMutate?: (data: any) => any;
	onSettled?: (data: any) => void;
};
