import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postResourceComment, deleteResourceComment, postPostComment, deletePostComment, deletePost, createPost, sendMessage, markChatAsRead, findOrCreateChat, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, deleteCalendarEventImage } from "./educators.api";

export const useCreateCommentMutation = (resourceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (comment: string) => {
            return await postResourceComment(resourceId, comment);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", resourceId],
                exact: true,
            });
        },
    });
};

export const useDeleteCommentMutation = (resourceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commentId: string) => {
            return await deleteResourceComment(resourceId, commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", resourceId],
                exact: true,
            });
        },
    });
};

export const useCreatePostCommentMutation = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (comment: string) => {
            return await postPostComment(postId, comment);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["post-comments", postId],
                exact: true,
            });
        },
    });
};

export const useDeletePostCommentMutation = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commentId: string) => {
            return await deletePostComment(postId, commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["post-comments", postId],
                exact: true,
            });
        },
    });
};

// export const useCreatePostMutation = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (post: FormData) => {
//             return await createPost(post);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["posts"],
//             });
//         },
//     });
// };

export const useCreatePostMutation = (filters: Record<string, any> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (post: FormData) => {
            return await createPost(post); // debe devolver el post creado
        },
        onSuccess: (newPost) => {
            queryClient.setQueryData(["posts", filters], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: [
                        {
                            ...old.pages[0],
                            data: [newPost, ...old.pages[0].data],
                        },
                        ...old.pages.slice(1),
                    ],
                };
            });

            // Opcional: refetch para sincronizar
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
};

// export const useDeletePostMutation = () => {
//     const queryClient = useQueryClient();

//     return useMutation<string, unknown, string>({
//         mutationFn: async (postId) => {
//             return await deletePost(postId);
//         },
//         onSuccess: (_, postId) => {
//             queryClient.removeQueries({ queryKey: ["posts"] });
//             queryClient.removeQueries({ queryKey: ["post-comments", postId], });
//             queryClient.removeQueries({ queryKey: ["post", postId], });
//         },
//     });
// };

export const useDeletePostMutation = (filters: Record<string, any> = {}) => {
    const queryClient = useQueryClient();

    return useMutation<string, unknown, string>({
        mutationFn: async (postId) => {
            return await deletePost(postId);
        },
        onSuccess: (_, postId) => {
            // Remover el post del cache de la lista
            queryClient.setQueryData(["posts", filters], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.filter((post: any) => post.id !== postId),
                    })),
                };
            });

            // También limpiás el cache de detalles y comentarios
            queryClient.removeQueries({ queryKey: ["post", postId] });
            queryClient.removeQueries({ queryKey: ["post-comments", postId] });
        },
    });
};




// CHATS
export const useSendMessage = (chatId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (message: string) => sendMessage(chatId, message),
        onSuccess: () => {
            // Refetch para que aparezca el nuevo mensaje
            queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] });
        },
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatId: string) => markChatAsRead(chatId),
        onSuccess: () => {
            // Refetch para que aparezca el nuevo mensaje
            queryClient.invalidateQueries({ queryKey: ['chat-previews'] });
        }
    });
}

export const useFindOrCreateChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (educatorId: string) => {
            return findOrCreateChat(educatorId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-previews'] });
        }
    });
}



// CALENDAR EVENTS
export const useCreateCalendarEventMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (calendarEvent: FormData) => {
            return await createCalendarEvent(calendarEvent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-events'], exact: false });
        },
    });
}

export const useUpdateCalendarEventMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventId, calendarEvent }: { eventId: string; calendarEvent: FormData }) => {
            return await updateCalendarEvent(eventId, calendarEvent);
        },
        onSuccess: (calendarEvent) => {
            queryClient.invalidateQueries({ queryKey: ['calendar-events'], exact: false });
            queryClient.invalidateQueries({
                queryKey: ['calendar-event', calendarEvent.id],
                exact: true, // Asegura que se invalide la consulta específica del evento actualizado
            });
        },
    });
};

export const useDeleteCalendarEventMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            return await deleteCalendarEvent(eventId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar-events'], exact: false });
        },
    });
};

export const useDeleteCalendarEventImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            return await deleteCalendarEventImage(eventId);
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({
                queryKey: ['calendar-event', id],
                exact: true, // Asegura que se invalide la consulta específica del evento actualizado
            });
        },
    });
}