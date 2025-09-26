import React from "react";
import { usePosts, useTags } from "../api/educators.queries";
import { CreatePostForm, PostCard, SuggestedPersons } from "../components";

export const Posts = () => {
  const [selectedTag, setSelectedTag] = React.useState<string | undefined>(
    undefined
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = usePosts({ tag: selectedTag });

  const { data: tags, isLoading: tagsLoading } = useTags();

  if (isError)
    return (
      <p className="flex-center h-32 bg-red-100 rounded-xl">
        <span className="text-red-500">Error loading posts</span>
      </p>
    );

  return (
    <div className="page-base">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <CreatePostForm tags={tags ?? []} />
          <h1 className="mb-2 text-lg font-medium">
            What's new? Share your thoughts with the community!
          </h1>

          {selectedTag && (
            <p className="text-sm text-gray-500 mb-2">
              Showing posts tagged with{" "}
              <span className="bg-main-100 text-main-400 text-xs font-medium px-2 py-1 rounded-full">
                #{tags?.find((tag) => tag.id === selectedTag)?.name}
              </span>
            </p>
          )}

          {/* Posts list */}
          <div className="mt-3">
            {isFetching && !data ? (
              <div className="flex-center h-32">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                {data?.pages[0].data.length === 0 && (
                  <p className="text-gray-500 text-center p-3 text-sm bg-gray-100 rounded-xl">
                    No posts yet. Be the first to post!
                  </p>
                )}

                {/* Render posts */}
                {data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.data.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </React.Fragment>
                ))}

                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-4 flex-center w-full h-12 bg-main-400 text-white rounded-xl"
                  >
                    {isFetchingNextPage ? (
                      <div className="loader h-6 w-6"></div>
                    ) : (
                      <span className="text-sm">Load more posts</span>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Tags</h2>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(undefined)}
                  className="text-sm text-main-400 underline mb-2"
                >
                  Clear filter
                </button>
              )}
            </div>
            {tagsLoading ? (
              <div className="flex-center h-16">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags?.map((tag) => (
                  <span
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`${
                      selectedTag === tag.id
                        ? "bg-main-300 text-main-500"
                        : "bg-main-100 text-main-400"
                    } text-xs font-medium px-2 py-1 rounded-full hover:cursor-pointer hover:bg-main-200 transition duration-300`}
                    title="Filter by tag"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <SuggestedPersons />
        </div>
      </div>
    </div>
  );
};
