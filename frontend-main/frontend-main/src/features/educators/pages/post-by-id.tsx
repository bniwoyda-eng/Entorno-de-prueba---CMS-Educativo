import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDeletePostMutation } from "../api/educators.mutations";
import { CustomAlert, getTimeSince } from "../../../utils";
import { useAuthStore } from "../../auth/auth.store";
import { usePost } from "../api/educators.queries";
import { PostComments, SuggestedPersons, SuggestedPosts } from "../components";

export const PostById = () => {
  const { postId } = useParams() as { postId: string };
  const { data: post, isLoading, isError } = usePost(postId);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const deletePostMutation = useDeletePostMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isError) {
      navigate("/educators/posts");
    }
  }, [isError, navigate]);

  if (!post || isLoading || !user) {
    return (
      <div className="flex-center h-32">
        <div className="loader" />
      </div>
    );
  }

  const isAuthor = user.educatorId === post.educator.id;

  const handleDeletePost = async () => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Delete post",
      description: "Are you sure you want to delete this post?",
      icon: "warning",
    });
    if (!isConfirmed) return;
    setIsDeleting(true);

    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        CustomAlert.alert("success", {
          title: "Post deleted",
          description: "Your post has been deleted successfully.",
        });
        navigate("/educators/posts");
      },
      onError: () => {
        CustomAlert.alert("error", {
          title: "Error deleting post",
          description:
            "There was an error deleting your post. Please try again.",
        });
      },
    });

    setIsDeleting(false);
  };

  return (
    <div className="page-base">
      <div className="mb-4">
        <NavLink
          to={`/educators/posts`}
          className="text-gray-500 hover:text-main-400 flex items-center gap-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </NavLink>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
            <div className="flex justify-between mb-3 items-start">
              <div className="flex">
                <NavLink
                  to={`/educators/posts/author/${post.educator.id}`}
                  title="View profile"
                >
                  <img
                    src={post.educator.profilePicture}
                    alt={post.educator.fullName}
                    className="w-10 h-10 rounded-full inline-block me-2"
                  />
                </NavLink>
                <div className="flex flex-col">
                  <NavLink
                    to={`/educators/posts/author/${post.educator.id}`}
                    className="font-medium text-sm hover:text-main-400"
                    title="View profile"
                  >
                    {post.educator.fullName}
                  </NavLink>

                  <span className="text-xs text-gray-500">
                    {getTimeSince(post.creation_date)}
                  </span>
                </div>
              </div>
              {isAuthor && (
                <button
                  title="Delete post"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 text-main-300 hover:text-main-400 inline-block " />
                </button>
              )}
            </div>
            <div className="col-span-1 lg:col-span-2">
              {post.images.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  {post.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.imageKey}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}

              {/* CONTENT */}
              <div>
                <NavLink
                  className="font-medium hover:underline text-xl"
                  to={`/educators/posts/${post.id}`}
                  title="View post"
                >
                  {post.title}
                </NavLink>
                <p className="text-sm text-gray-700 my-1">{post.content}</p>
              </div>

              {/* TAGS */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-main-100 text-main-500 text-xs font-medium px-2 py-1 rounded-full hover:bg-main-200 transition duration-300 hover:cursor-pointer"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs mt-3 flex gap-2 text-gray-500">
                <div className="flex">
                  <Eye className="w-4 h-4 me-1" />
                  {post.views} views
                </div>
              </div>
            </div>
          </div>

          <div>
            <PostComments postId={postId} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-1 space-y-4">
          <SuggestedPosts shuffleKey={postId} />
          <SuggestedPersons shuffleKey={postId} />
        </div>
      </div>
    </div>
  );
};
