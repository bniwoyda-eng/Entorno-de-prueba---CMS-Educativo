import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  resourcesSingularDictionary,
  resourcesDictionary,
  Resource,
} from "../types";
import { useResources } from "../api/educators.queries";
import { Calendar, Eye, Timer } from "lucide-react";
import { Breadcrumb } from "../../../components";
import { formatDate } from "../../../utils";

export const ResourcesByType = () => {
  const navigate = useNavigate();
  const { resourceType } = useParams();
  if (!resourceType) {
    navigate("/educators/resources");
  }

  const type = resourcesSingularDictionary[resourceType as string];
  const dictionary = resourcesDictionary[type as Resource];

  const { data: response, isLoading } = useResources({
    resourceType: type as Resource,
    page: 1,
    limit: 20,
  });

  if (isLoading || !response) {
    return (
      <div className="flex-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="page-base">
      <Breadcrumb
        items={[
          { label: "Resources", to: "/educators/resources" },
          { label: dictionary.title },
        ]}
      />

      <h1 className="text-xl mb-4">{dictionary.title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {response.data.map((resource, index) => (
          <div
            key={index}
            draggable="false"
            className="bg-white rounded-xl overflow-hidden h-full flex flex-col shadow-animated"
          >
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              title={resource.title}
              className="w-full h-32 object-cover"
              draggable="false"
            />
            <div className="px-4 py-3 flex flex-col justify-between gap-2 flex-1">
              <div>
                <NavLink
                  to={`/educators/resources/${dictionary.plural}/${resource.id}`}
                >
                  <p
                    className="text-sm line-clamp-2 mb-2 hover:text-main-400 hover:font-medium hover:underline"
                    title={resource.title}
                  >
                    {resource.title}
                  </p>
                </NavLink>
                <p
                  className="text-xs text-gray-500 line-clamp-2"
                  title={resource.extract}
                >
                  {resource.extract}
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <div className="flex gap-2 mb-2">
                  <span className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {resource.minsDuration} min
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {resource.views}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(resource.creation_date, "MMMM D, YYYY")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
