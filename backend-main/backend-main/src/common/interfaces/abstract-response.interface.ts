export interface AbstractResponse<T> {
    code: number;
    result: string;
    payload: {
        data: T;
    };
}
