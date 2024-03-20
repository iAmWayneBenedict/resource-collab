type TErrorAPIResponse = {
    data: null[] | string[] | Record<string, any> | null;
    status: number;
    message: string;
}