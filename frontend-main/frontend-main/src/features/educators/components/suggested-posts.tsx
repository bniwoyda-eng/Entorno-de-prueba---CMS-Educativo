import { ChevronRight, Eye, MessageCircleMore } from "lucide-react";
import { useSuggestedPosts } from "../api/educators.queries";
import { NavLink } from "react-router-dom";
import React from "react";

// Props opcionales con shuffleKey
interface SuggestedPostsProps {
  count?: number;
  shuffleKey?: string | number;
}

export const SuggestedPosts: React.FC<SuggestedPostsProps> = ({
  count = 5,
  shuffleKey,
}) => {
  const { data: suggestedPosts, isLoading, isError } = useSuggestedPosts(15);
  const [shuffledPosts, setShuffledPosts] = React.useState<
    typeof suggestedPosts
  >([]);

  // Re-baraja los posts cada vez que cambia el shuffleKey o los datos
  React.useEffect(() => {
    if (suggestedPosts) {
      const shuffled = [...suggestedPosts].sort(() => Math.random() - 0.5);
      setShuffledPosts(shuffled.slice(0, count));
    }
  }, [suggestedPosts, shuffleKey, count]);

  return (
    <div className="card">
      <h2 className="card-title mb-2">Suggested posts</h2>

      {isLoading ? (
        <div className="flex-center h-16">
          <div className="loader" />
        </div>
      ) : isError ? (
        <p className="bg-red-100 text-red-500 text-sm p-3 rounded-xl">
          Error loading suggested posts
        </p>
      ) : (
        <div>
          {shuffledPosts?.length === 0 && (
            <p className="text-gray-500 text-sm">No suggestions found</p>
          )}

          {shuffledPosts?.map((post) => (
            <NavLink
              key={post.id}
              to={`/educators/posts/${post.id}`}
              className="flex items-center hover:bg-gray-100 py-2 px-3 rounded-lg cursor-pointer"
            >
              <div className="flex flex-col">
                <p className="line-clamp-1 text-sm">{post.title}</p>
                <div className="text-xs mt-1 flex gap-2 text-gray-500">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 me-1" />
                    {post.views} views
                  </div>
                  <span>|</span>
                  <div className="flex items-center">
                    <MessageCircleMore className="w-4 h-4 me-1" />
                    {post.replies || 0} replies
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <ChevronRight className="font-bold text-main-500" />
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
