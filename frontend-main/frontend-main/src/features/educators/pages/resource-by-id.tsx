import { useCallback, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Calendar, Download, Eye, Paperclip, Timer } from "lucide-react";
import {
  Breadcrumb,
  Button,
  ImageWithFallback,
  SimpleVideoPlayer,
} from "../../../components";
import {
  Resource,
  Resources,
  resourcesDictionary,
  resourcesSingularDictionary,
} from "../types";
import { useResource, useResources } from "../api/educators.queries";
import { formatDate } from "../../../utils";
import { ResourceComments } from "../components";

export const ResourceById = () => {
  const navigate = useNavigate();
  const [showAllParagraphs, setShowAllParagraphs] = useState(false);

  const { resourceType, resourceId } = useParams() as {
    resourceType: string;
    resourceId: string;
  };

  if (!resourceType || !resourceId) {
    navigate("/educators/resources");
  }

  const type = resourcesSingularDictionary[resourceType];
  const dictionary = resourcesDictionary[type as Resource];

  const { data: resource, isLoading, isError } = useResource(type, resourceId);
  const { data: suggestedResources } = useResources({
    resourceType: type,
    page: 1,
    limit: 20,
  });

  const shuffledResources = useCallback(() => {
    if (!suggestedResources) return [];
    const filteredResources = suggestedResources.data.filter(
      (res) => res.id !== resourceId
    );
    const shuffled = filteredResources.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [suggestedResources, resourceId]);

  if (isError) {
    navigate("/educators/resources");
  }
  if (!type) {
    return (
      <div className="flex-center h-64">
        <p>Resource type not found.</p>
      </div>
    );
  }
  if (isLoading || !resource) {
    return (
      <div className="flex-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  const {
    contentUrl,
    creation_date,
    extract,
    minsDuration,
    views,
    title,
    attachments,
    paragraphs,
  } = resource;

  const displayedParagraphs = showAllParagraphs
    ? paragraphs
    : paragraphs.slice(0, 3);

  return (
    <div className="page-base scroll-smooth">
      <Breadcrumb
        items={[
          { label: "Resources", to: "/educators/resources" },
          {
            label: dictionary.title,
            to: `/educators/resources/${dictionary.plural}`,
          },
          { label: title },
        ]}
      />
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="col-span-1 xl:col-span-2">
          {type == Resources.VIDEO ? (
            <SimpleVideoPlayer title={title} url={contentUrl} />
          ) : (
            <ImageWithFallback
              src={contentUrl}
              alt={title}
              title={title}
              imageClassName="rounded-t-2xl"
            />
          )}

          <div className="flex flex-col items-start xl:flex-row justify-between gap-4 my-4">
            <div>
              <h1 className="text-2xl font-medium">{title}</h1>
              <p className="my-2">{extract}</p>
              <div className="text-xs text-gray-500 mt-2">
                <div className="flex gap-2">
                  <span className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {minsDuration} min
                  </span>
                  <span>|</span>
                  {attachments.length > 0 && (
                    <span
                      className="flex items-center gap-1 hover:underline"
                      onClick={() => {
                        document
                          .getElementById("attachments")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <Paperclip className="w-4 h-4" />
                        {attachments.length} attachments
                      </span>
                      <span>|</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {views}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted on {formatDate(creation_date, "MMMM D, YYYY")}
                  </span>
                </div>
              </div>
            </div>
            <Button transparent icon="save" text="Save" onClick={() => {}} />
          </div>

          <div className="text-gray-700 space-y-3 my-3">
            {displayedParagraphs.map((p, index) => (
              <p key={index} className="mb-2">
                {p}
              </p>
            ))}

            {paragraphs.length > 3 && (
              <button
                onClick={() => setShowAllParagraphs(!showAllParagraphs)}
                className="text-sm text-main-400 hover:underline mt-2"
              >
                {showAllParagraphs ? "Mostrar menos" : "Seguir leyendo..."}
              </button>
            )}
          </div>

          {attachments.length > 0 && (
            <div>
              <hr className="my-4" />
              <div className="flex items-center gap-2 mb-2" id="attachments">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 font-medium ml-1">
                  Attachments
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center text-sm gap-2 p-1 text-main-400 hover:underline cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-main-400" />
                    {attachment.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3">
            <ResourceComments resourceId={resourceId} />
          </div>
        </div>

        <div className="col-span-1 xl:col-span-1">
          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-lg font-medium mb-4">Suggested resources</h2>
            <div className="flex flex-col gap-4">
              {shuffledResources().map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl overflow-hidden flex"
                >
                  <NavLink
                    to={`/educators/resources/${resourceType}/${resource.id}`}
                  >
                    <ImageWithFallback
                      className="h-24 w-24 object-cover"
                      src={resource.thumbnailUrl}
                      alt={resource.title}
                      title={resource.title}
                      imageClassName="rounded-xl"
                    />
                  </NavLink>
                  <div className="px-4 flex flex-col  gap-2 flex-1">
                    <div>
                      <NavLink
                        to={`/educators/resources/${resourceType}/${resource.id}`}
                        className="text-sm font-medium text-gray-800 hover:text-main-400 hover:underline"
                      >
                        <p
                          className="text-sm line-clamp-1 mb-2"
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
                    <div className="text-xs text-gray-500">
                      <div className="flex gap-2 mb-2">
                        <span className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          {resource.minsDuration} min
                        </span>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(resource.creation_date, "MMMM D, YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
