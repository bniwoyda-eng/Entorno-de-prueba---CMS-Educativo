import { useNavigate, useParams } from "react-router-dom";
import { useAuthorProfile } from "../api/educators.queries";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { PostCard } from "../components";

export const PostsByAuthor = () => {
  const { educatorId } = useParams() as { educatorId: string };
  const { data, isLoading, isError } = useAuthorProfile(educatorId);
  const navigate = useNavigate();

  if (isError) {
    navigate("/educators/posts");
    return null; // Evitar que se renderice el resto del componente
  }

  if (!data || isLoading) {
    return (
      <div className="flex-center h-32">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="page-base">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-main-400 flex items-center gap-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      <div className="relative mb-4">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-main-100 to-main-500 rounded-xl" />

        {/* Contenido principal */}
        <div className="relative flex flex-col items-center -mt-20 px-4">
          {/* Contenedor de imagen con botón superpuesto */}
          <div className="relative">
            <img
              src={data.educator.profilePicture}
              alt="Profile"
              className="w-32 h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover"
            />

            {/* Botón superpuesto */}
            <button
              className="absolute -bottom-2 -right-0 bg-white border text-main-500 text-sm p-2 rounded-full shadow hover:bg-main-50"
              title="Send message"
            >
              <MessageCircle />
            </button>
          </div>

          {/* Info */}
          <div className="text-center mt-4">
            <h2 className="text-lg font-semibold">
              {data.educator.fullName}{" "}
              <span className="text-green-500 ms-1">●</span>
            </h2>
            <p className="text-sm text-gray-500">
              {data.posts.length > 0
                ? `${data.posts.length} posts`
                : "No posts yet"}
            </p>
          </div>
        </div>
      </div>
      <div>
        {/* Render posts */}
        {data.posts.length > 0 ? (
          <>
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        ) : (
          <p className="text-gray-500 flex-center p-3 text-sm bg-gray-200 h-16 rounded-xl">
            <b className="me-1">{data.educator.fullName} </b> has no posts yet.
            We hope to see one soon!
          </p>
        )}
      </div>
    </div>
  );
};
