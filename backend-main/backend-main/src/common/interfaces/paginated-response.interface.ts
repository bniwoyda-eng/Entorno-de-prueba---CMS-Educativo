export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
    message?: string;
    statusCode?: number;
}