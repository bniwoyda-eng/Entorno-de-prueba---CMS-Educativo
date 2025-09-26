import { NavLink } from "react-router-dom";
import { IPost } from "../types/posts.types";
import { getTimeSince } from "../../../utils";
import { Eye, MessageCircleMore, UnfoldVertical } from "lucide-react";

interface PostCardProps {
  post: IPost;
}
export const PostCard = ({ post }: PostCardProps) => {
  return (
    <div key={post.id} className="bg-white p-4 rounded-xl mb-4 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between">
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
            <NavLink to={`/educators/posts/${post.id}`} title="View post">
              <span className="text-xs text-gray-500 hover:underline">
                {getTimeSince(post.creation_date)}
              </span>
            </NavLink>
          </div>
        </div>
        <NavLink
          to={`/educators/posts/${post.id}`}
          className="bg-main-300 flex-center rounded-full w-6 h-6 hover:bg-main-400 transition duration-300"
          title="View post"
        >
          <UnfoldVertical className="w-4 h-4 rotate-45 text-white" />
        </NavLink>
      </div>

      <hr className="my-3" />

      {/* CONTENT */}
      <div>
        <NavLink
          className="font-medium hover:underline"
          to={`/educators/posts/${post.id}`}
          title="View post"
        >
          {post.title}
        </NavLink>
        <p className="text-sm text-gray-700 my-1 line-clamp-3">
          {post.content}
        </p>
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

      {/* IMAGES */}
      {post.images.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
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

      <div className="text-xs mt-3 flex gap-2 text-gray-500">
        <div className="flex">
          <Eye className="w-4 h-4 me-1" />
          {post.views} views
        </div>
        <span>|</span>
        <div className="flex">
          <MessageCircleMore className="w-4 h-4 me-1" />
          {post.replies || 0} replies
        </div>
      </div>

    </div>
  );
};
