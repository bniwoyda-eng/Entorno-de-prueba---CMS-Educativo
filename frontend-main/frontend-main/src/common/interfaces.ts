export interface ICommonResponse<T> {
    payload: {
        data: T[];
    }
    code: number;
    result: string;
}

export interface IPaginationResponse<T> {
    data: T[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }
    message?: string;
    statusCode?: number;
}

export interface IPaginationParams {
    page?: number;
    limit?: number;
    [key: string]: any;
}