import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
    getGroupedResources, getResources, getResource, getResourceComments,
    getPosts, getPost, getPostComments,
    getTags, getAuthorProfile,
    getSuggestedPersons, getSuggestedPosts,
    getColleagues,
    getChatPreviews,
    getChatMessages,
    getCalendarEvent,
    getCalendarEvents,
    getCourseList,
    getCourseStatistics,
    getCourseEnrolledStudents,
    getCourseStatisticsForStudent
} from "./educators.api";
import { ResourceParams } from "../types";
import { PostsQueryParams } from "../types/posts.types";
import { IPaginatedMessages } from "../types/chats.types";
import { EventFilter } from "../pages";

// const MIN1 = 1000 * 60;
const MIN3 = 1000 * 60 * 3;
const MIN5 = 1000 * 60 * 5;

// Resources
export const useGroupedResources = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['resources'],
        queryFn: getGroupedResources,
        staleTime: MIN5,
    });
    return { data, isLoading, isError };
}

export const useResources = (params?: ResourceParams) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['resources', params],
        queryFn: () => getResources(params),
        staleTime: MIN5,
    });
    return { data, isLoading, isError };
}

export const useResource = (resourceType: string, resourceId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['resources', resourceId],
        queryFn: () => getResource(resourceType, resourceId),
        staleTime: MIN5,
        retry: false
    });
    return { data, isLoading, isError };
}

export const useResourceComments = (resourceId: string, limit = 5) => {
    return useInfiniteQuery({
        queryKey: ['comments', resourceId],
        enabled: !!resourceId,
        queryFn: async ({ pageParam = 1 }) => {
            return await getResourceComments(resourceId, {
                page: pageParam,
                limit,
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { meta } = lastPage;
            const nextPage = meta.currentPage + 1;
            return nextPage <= meta.totalPages ? nextPage : undefined;
        },
        staleTime: 1000 * 30, // 30 segundos, podés ajustarlo
    });
};


// Posts
export const usePosts = (params?: PostsQueryParams) => {
    return useInfiniteQuery({
        queryKey: ['posts', params],
        queryFn: async ({ pageParam = 1 }) => {
            return await getPosts({
                ...params,
                page: pageParam,
                limit: 10,
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { meta } = lastPage;
            const nextPage = meta.currentPage + 1;
            return nextPage <= meta.totalPages ? nextPage : undefined;
        },
        staleTime: MIN3,
    });
}

export const usePost = (postId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPost(postId),
        staleTime: MIN3,
        retry: false
    });
    return { data, isLoading, isError };
}

export const usePostComments = (postId: string, limit = 5) => {
    return useInfiniteQuery({
        queryKey: ['post-comments', postId],
        enabled: !!postId,
        queryFn: async ({ pageParam = 1 }) => {
            return await getPostComments(postId, {
                page: pageParam,
                limit,
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { meta } = lastPage;
            const nextPage = meta.currentPage + 1;
            return nextPage <= meta.totalPages ? nextPage : undefined;
        },
        staleTime: 1000 * 30, // 30 segundos, podés ajustarlo
    });
}

export const useTags = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
        staleTime: MIN5,
    });
    return { data, isLoading, isError };
}

export const useAuthorProfile = (authorId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['author-profile', authorId],
        queryFn: () => getAuthorProfile(authorId),
        staleTime: MIN3,
        retry: false
    });
    return { data, isLoading, isError };
}


// Suggested persons/posts
export const useSuggestedPosts = (count: number) => {
    return useQuery({
        queryKey: ['suggested-posts'],
        queryFn: () => getSuggestedPosts(count),
        staleTime: MIN5,
        retry: false
    });
}

export const useSuggestedPersons = (count: number) => {
    return useQuery({
        queryKey: ['suggested-persons'],
        queryFn: () => getSuggestedPersons(count),
        staleTime: MIN5,
        retry: false
    });
}


// CHAT
export const useColleagues = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['colleagues'],
        queryFn: getColleagues,
        staleTime: MIN5,
    });
    return { data, isLoading, isError };
}

export const useChatPreviews = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['chat-previews'],
        queryFn: getChatPreviews,
        staleTime: 5 * 1000, // 5 segundos
    });
    return { data, isLoading, isError, refetch };
}

export const useChatMessages = (chatId: string, limit = 20) => {
    return useInfiniteQuery<IPaginatedMessages, Error>({
        queryKey: ['chatMessages', chatId],
        queryFn: ({ pageParam }) =>
            getChatMessages(chatId, {
                limit,
                before: pageParam as string | undefined,
            }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.messages || lastPage.messages.length === 0 || !lastPage.hasMore) {
                return undefined;
            }
            return lastPage.messages[0].id;
        },
        staleTime: 1000 * 60,
    });
};



// Calendar events queries
export const useCalendarEvents = ({ filter = "all", incoming = false }: { filter: EventFilter, incoming?: boolean }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['calendar-events', filter],
        queryFn: () => getCalendarEvents(filter, incoming),
        // staleTime: 1000 * 60 * 5,
    });
    return { data, isLoading, isError };
};

export const useCalendarEvent = (eventId: string) => {
    const { data, refetch, isLoading, isError } = useQuery({
        queryKey: ['calendar-event', eventId],
        queryFn: () => getCalendarEvent(eventId),
        enabled: !!eventId,
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: false
    });
    return { data, refetch, isLoading, isError };
}

// COURSES
export const useCourseList = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['course-list'],
        queryFn: getCourseList,
        staleTime: MIN5,
    });
    return { data, isLoading, isError };
}

export const useCourseStatistics = (courseId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['course-statistics', courseId],
        queryFn: () => getCourseStatistics(courseId),
        staleTime: MIN5,
        enabled: !!courseId,
    });
    return { data, isLoading, isError };
}

export const useCourseEnrolledStudents = (courseId: string, sortBy: 'name' | 'progress-asc' | 'progress-desc' = 'name') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['course-enrolled-students', courseId, sortBy],
        queryFn: () => getCourseEnrolledStudents(courseId, sortBy),
        staleTime: MIN5,
        enabled: !!courseId,
    });
    return { data, isLoading, isError };
}

export const useCourseStatisticsForStudent = (courseId: string, studentId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['course-statistics-for-student', courseId, studentId],
        queryFn: () => getCourseStatisticsForStudent(courseId, studentId),
        staleTime: MIN5,
        enabled: !!courseId && !!studentId,
    });
    return { data, isLoading, isError };
}   