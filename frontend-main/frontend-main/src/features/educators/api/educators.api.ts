import csmApi from "../../../api/csm.api";
import { IPaginationParams, IPaginationResponse } from '../../../common/interfaces';
import { GroupedResource, ResourceParams, IResource, IResourceDetail, IResourceComment } from "../types/resources.types";
import { IAuthorProfile, IPost, IPostComment, ITag, PostsQueryParams } from "../types/posts.types";
import { ISuggestedEducator, ISuggestedPost } from "../types";
import { IChatPreview, IMessagesParams, IPaginatedMessages } from "../types/chats.types";
import { ICalendarEvent } from "../types/calendar-events.types";
import { EventFilter } from "../pages";
import { ICourseStatistics, ICourseStatisticsForStudent, IStudent } from "../types/courses.types";

export const getGroupedResources = async () => {
    const { data } = await csmApi.get<GroupedResource[]>("/resources/grouped-by-type");
    return data;
}

export const getResources = async (params?: ResourceParams) => {
    const { data } = await csmApi.get<IPaginationResponse<IResource>>("/resources", { params });
    return data;
}

export const getResource = async (resourceType: string, resourceId: string) => {
    const { data } = await csmApi.get<IResourceDetail>(`/resources/${resourceType}/${resourceId}/attachments`);
    return data;
}

export const getResourceComments = async (resourceId: string, params?: IPaginationParams) => {
    const { data } = await csmApi.get<IPaginationResponse<IResourceComment>>(`/resources/${resourceId}/comments`, { params });
    return data;
}

export const postResourceComment = async (resourceId: string, comment: string) => {
    const { data } = await csmApi.post<IResourceComment>(`/resources/${resourceId}/comments`, { comment });
    return data;
}

export const deleteResourceComment = async (resourceId: string, commentId: string) => {
    const { data } = await csmApi.delete<string>(`/resources/${resourceId}/comments/${commentId}`);
    return data;
}


// Posts
export const getPosts = async (params?: PostsQueryParams) => {
    const { data } = await csmApi.get<IPaginationResponse<IPost>>("/posts", { params });
    return data;
}

export const getPost = async (postId: string) => {
    const { data } = await csmApi.get<IPost>(`/posts/${postId}`);
    return data;
}

export const getPostComments = async (postId: string, params?: IPaginationParams) => {
    const { data } = await csmApi.get<IPaginationResponse<IPostComment>>(`/posts/${postId}/comments`, { params });
    return data;
}

export const postPostComment = async (postId: string, comment: string) => {
    const { data } = await csmApi.post<IPostComment>(`/posts/${postId}/comments`, { comment });
    return data;
}

export const deletePostComment = async (postId: string, commentId: string) => {
    const { data } = await csmApi.delete<string>(`/posts/${postId}/comments/${commentId}`);
    return data;
}

export const getTags = async () => {
    const { data } = await csmApi.get<ITag[]>("/tags");
    return data;
}

export const getAuthorProfile = async (authorId: string) => {
    const { data } = await csmApi.get<IAuthorProfile>(`/posts/author/${authorId}`);
    return data;
}

export const deletePost = async (postId: string) => {
    const { data } = await csmApi.delete<string>(`/posts/${postId}`);
    return data;
}

export const createPost = async (formData: FormData) => {
    const { data } = await csmApi.post<IPost>(`/posts`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const getSuggestedPersons = async (count: number) => {
    const { data } = await csmApi.get<ISuggestedEducator[]>(`/educators/suggested?count=${count}`);
    return data;
}

export const getSuggestedPosts = async (count: number) => {
    const { data } = await csmApi.get<ISuggestedPost[]>(`/posts/suggested?count=${count}`);
    return data;
}




// CHAT
export const getColleagues = async () => {
    const { data } = await csmApi.get<ISuggestedEducator[]>("/educators/colleagues");
    return data;
}

export const getChatPreviews = async () => {
    const { data } = await csmApi.get<IChatPreview[]>("/chats/previews");
    return data;
}

export const getChatMessages = async (chatId: string, params: IMessagesParams): Promise<IPaginatedMessages> => {
    const { data } = await csmApi.get(`/chats/${chatId}/messages`, { params });
    return data;
};

export const sendMessage = async (chatId: string, message: string) => {
    const { data } = await csmApi.post(`/chats/${chatId}/send-message`, { message });
    return data;
}

export const markChatAsRead = async (chatId: string) => {
    const { data } = await csmApi.patch(`/chats/${chatId}/mark-as-read`);
    return data;
}

export const findOrCreateChat = async (educatorId: string) => {
    const { data } = await csmApi.post('/chats', { educatorId });
    return data;
}



// CALENDAR EVENTS
export const createCalendarEvent = async (formData: FormData) => {
    const { data } = await csmApi.post<ICalendarEvent>('/calendar-event', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const getCalendarEvents = async (filter: EventFilter = 'all', incoming?: boolean) => {

    const params: any = { filter };
    if (incoming !== undefined) params.incoming = incoming.toString();

    const { data } = await csmApi.get<{ data: ICalendarEvent[]; total: number }>(
        `/calendar-event`, { params }
    );
    return data;
};

export const getCalendarEvent = async (eventId: string) => {
    const { data } = await csmApi.get<ICalendarEvent>(`/calendar-event/${eventId}`);
    return data;
}

export const updateCalendarEvent = async (eventId: string, formData: FormData) => {
    const { data } = await csmApi.patch<ICalendarEvent>(`/calendar-event/${eventId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const deleteCalendarEvent = async (eventId: string) => {
    const { data } = await csmApi.delete<string>(`/calendar-event/${eventId}`);
    return data;
}

export const deleteCalendarEventImage = async (eventId: string) => {
    const { data } = await csmApi.delete<string>(`/calendar-event/${eventId}/image`);
    return data;
}


// COURSES
export const getCourseList = async () => {
    const { data } = await csmApi.get<ICourseStatistics["course"][]>("/courses/list");
    return data;
}

export const getCourseStatistics = async (courseId: string) => {
    const { data } = await csmApi.get<ICourseStatistics>(`/courses/${courseId}/statistics`);
    return data;
}

export const getCourseEnrolledStudents = async (courseId: string, sortBy: 'name' | 'progress-asc' | 'progress-desc' = 'name') => {
    const { data } = await csmApi.get<IStudent[]>(`/courses/${courseId}/enrolled-students?sortBy=${sortBy}`);
    return data;
}

export const getCourseStatisticsForStudent = async (courseId: string, studentId: string) => {
    const { data } = await csmApi.get<ICourseStatisticsForStudent>(`/courses/${courseId}/statistics-for-student/${studentId}`);
    return data;
}