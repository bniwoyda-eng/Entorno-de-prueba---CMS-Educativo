import React, { useRef } from "react";
import { MessageCircleMore, Send, X } from "lucide-react";
import { usePostComments } from "../api/educators.queries";
import { CustomAlert, getTimeSince } from "../../../utils";
import {
  useCreatePostCommentMutation,
  useDeletePostCommentMutation,
} from "../api/educators.mutations";
import { useAuthStore } from "../../auth/auth.store";
import { NavLink } from "react-router-dom";

interface Props {
  postId: string;
}

export const PostComments = ({ postId }: Props) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePostComments(postId);

  const { mutate: createComment, isPending: isCreating } =
    useCreatePostCommentMutation(postId);
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeletePostCommentMutation(postId);

  if (isLoading || !data) {
    return (
      <div className="flex-center h-32">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError)
    return (
      <p className="flex-center h-32 bg-red-100 rounded-xl">
        <span className="text-red-500">Error loading comments</span>
      </p>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const comment = textareaRef.current?.value.trim();
    if (!comment) return;

    const { isConfirmed } = await CustomAlert.confirm({
      title: "Are you sure?",
      description: "Do you want to post this comment?",
    });
    if (!isConfirmed) return;

    createComment(comment, {
      onSuccess: () => {
        if (textareaRef.current) textareaRef.current.value = "";
        CustomAlert.toast("success", "Comment posted successfully!");
      },
      onError: () => {
        console.error("Error creating comment");
        CustomAlert.toast("error", "Error posting comment");
      },
    });
  };

  const handleDelete = async (commentId: string) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Are you sure?",
      description: "Do you want to delete this comment?",
    });
    if (!isConfirmed) return;
    deleteComment(commentId, {
      onSuccess: () => {
        CustomAlert.toast("success", "Comment deleted successfully!");
      },
      onError: () => {
        console.error("Error deleting comment");
        CustomAlert.toast("error", "Error deleting comment");
      },
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-lg font-medium mb-4 text-main-400">
        <MessageCircleMore className="w-4 h-4 inline-block me-2" />
        Comments ({data.pages[0].meta.totalItems})
      </h2>
      <div className="flex flex-col gap-2">
        <div className="flex">
          <img
            src={user.profilePicture}
            alt="User Avatar"
            className="w-8 h-8 rounded-full inline-block me-2"
          />
          <form
            onSubmit={handleSubmit}
            className="flex-1 w-full flex gap-2 items-end mb-2"
          >
            <textarea
              rows={1}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-xl p-3 text-sm"
              ref={textareaRef}
              disabled={isCreating}
            />
            <button
              type="submit"
              disabled={isCreating}
              className="bg-main-400 text-white rounded-xl px-4 py-2 mt-2"
            >
              <Send className="w-4 h-4 inline-block" />
            </button>
          </form>
        </div>
        {data.pages[0].data.length === 0 && (
          <p className="text text-gray-500 text-center p-3 text-sm bg-gray-100 rounded-xl">
            No comments yet. Be the first to comment!
          </p>
        )}
        {/* Render comments */}
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-3 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <img
                      src={comment.educator.profilePicture}
                      alt={comment.educator.fullName}
                      className="w-8 h-8 rounded-full inline-block me-2"
                    />
                    <NavLink
                      to={`/educators/posts/author/${comment.educator.id}`}
                      className="font-medium text-sm hover:text-main-400 hover:underline"
                    >
                      {comment.educator.fullName}
                    </NavLink>
                    <span className="text-xs text-main-400 ms-2">
                      {getTimeSince(comment.creation_date)}
                    </span>
                  </div>
                  {user.educatorId === comment.educator.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={isDeleting}
                      className="text-main-300 hover:text-main-500"
                      title="Delete comment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 flex-center w-full h-12 bg-main-400 text-white rounded-xl"
        >
          {isFetchingNextPage ? (
            <div className="loader h-6 w-6"></div>
          ) : (
            <span className="text-sm">Load more comments</span>
          )}
        </button>
      )}
    </div>
  );
};
