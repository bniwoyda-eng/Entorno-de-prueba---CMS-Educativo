import { ChevronRight } from "lucide-react";
import { useSuggestedPersons } from "../api/educators.queries";
import { NavLink } from "react-router-dom";
import React from "react";

interface SuggestedPersonsProps {
  count?: number;
  shuffleKey?: string | number;
}

export const SuggestedPersons: React.FC<SuggestedPersonsProps> = ({
  count = 5,
  shuffleKey,
}) => {
  const {
    data: suggestedPersons,
    isLoading,
    isError,
  } = useSuggestedPersons(15); // trae más de lo necesario
  const [shuffledPersons, setShuffledPersons] = React.useState<
    typeof suggestedPersons
  >([]);

  React.useEffect(() => {
    if (suggestedPersons) {
      const shuffled = [...suggestedPersons].sort(() => Math.random() - 0.5);
      setShuffledPersons(shuffled.slice(0, count));
    }
  }, [suggestedPersons, shuffleKey, count]);

  return (
    <div className="card">
      <h2 className="card-title mb-2">Suggested persons</h2>

      {isLoading ? (
        <div className="flex-center h-16">
          <div className="loader" />
        </div>
      ) : isError ? (
        <p className="bg-red-100 text-red-500 text-sm p-3 rounded-xl">
          Error loading suggested persons
        </p>
      ) : (
        <div>
          {shuffledPersons?.length === 0 && (
            <p className="text-gray-500 text-sm">No suggestions found</p>
          )}
          {shuffledPersons?.map((person) => (
            <NavLink
              key={person.id}
              to={`/educators/posts/author/${person.id}`}
              className="flex items-center hover:bg-gray-100 py-2 px-3 rounded-lg cursor-pointer"
            >
              <div className="flex items-center">
                <img
                  src={person.profilePicture}
                  alt={person.fullName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-sm hover:text-main-500">
                    {person.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {person.totalPosts > 0
                      ? `${person.totalPosts} posts`
                      : "No posts yet"}
                  </p>
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
