export interface AbstractPaginationResponse<T> {
    code: number;
    result: string;
    payload: {
        data: T;
        total: number;
        page: number;
        totalPages: number;
    };
}
