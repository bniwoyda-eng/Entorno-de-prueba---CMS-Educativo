import { useMutation, useQuery, useQueryClient, UseQueryOptions, keepPreviousData } from "@tanstack/react-query";
import { IPaginationResponse } from "../common/interfaces";


type PaginationParams = {
    page?: number;
    limit?: number;
};

type QueryParams = Record<string, any>;

export const useGenericPaginatedQuery = <T>(
    queryKey: string,
    fetchFn: (params: PaginationParams & QueryParams) => Promise<IPaginationResponse<T>>,
    params: PaginationParams & QueryParams = {},
    options: Partial<UseQueryOptions<IPaginationResponse<T>, Error>> = {}
) => {
    const mergedParams: Required<PaginationParams> & QueryParams = {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...params,
    };

    return useQuery({
        queryKey: [queryKey, mergedParams],
        queryFn: () => fetchFn(mergedParams),
        placeholderData: keepPreviousData,
        // staleTime: 1000 * 60,
        retry: false,
        ...options,
    });
};

export const useGenericListQuery = <T>(
    queryKey: string | string[],
    fetchFn: () => Promise<T[]>,
    options: Partial<UseQueryOptions<T[], Error>> = {}
) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: fetchFn,
        // staleTime: 1000 * 60 * 1,
        ...options,
    });
};

export const useGenericItemQuery = <T>(
    queryKey: string | string[],
    id: string | undefined,
    fetchFn: (id: string) => Promise<T>,
    options: Partial<UseQueryOptions<T, Error>> = {}
) => {
    return useQuery({
        queryKey: [queryKey, id],
        queryFn: () => fetchFn(id!),
        enabled: !!id,
        // staleTime: 1000 * 60 * 1,
        retry: false,
        ...options,
    });
};


export const useGenericMutation = <TVariables, TData = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    invalidateKey: string | string[]
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: Array.isArray(invalidateKey) ? invalidateKey : [invalidateKey],
            });
        },
    });
};
