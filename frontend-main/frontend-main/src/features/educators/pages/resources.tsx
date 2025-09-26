import { useGroupedResources } from "../api/educators.queries";
import { GroupedResource, resourcesDictionary } from "../types";
import { FlickingCarousel } from "../../../components";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const Resources = () => {
  const { data: groupedResources, isLoading } = useGroupedResources();
  if (!groupedResources || isLoading) {
    return (
      <div className="flex-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {groupedResources.map((resource, index) => (
          <ResourceButton key={index} resource={resource} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {groupedResources.map((group, index) => (
          <FlickingCarousel
            title={resourcesDictionary[group.resourceType].title}
            key={index}
          >
            {group.resources.map((item, index) => (
              <div
                className="w-56 m-2 rounded-xl overflow-hidden shadow-animated"
                draggable="false"
                key={index}
              >
                <div className="bg-white overflow-hidden h-full">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    title={item.title}
                    className="w-full h-32 object-cover"
                    draggable="false"
                  />
                  <div className="px-4 py-3">
                    <NavLink
                      to={`/educators/resources/${
                        resourcesDictionary[item.resourceType].plural
                      }/${item.id}`}
                    >
                      <p
                        className="text-sm line-clamp-2 mb-2 hover:text-main-400 hover:font-medium hover:underline"
                        title={item.title}
                      >
                        {item.title}
                      </p>
                    </NavLink>
                    <p
                      className="text-xs text-gray-500 line-clamp-2"
                      title={item.extract}
                    >
                      {item.extract}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </FlickingCarousel>
        ))}
      </div>
    </div>
  );
};

interface ResourceButtonProps {
  resource: GroupedResource;
}

const ResourceButton = ({ resource }: ResourceButtonProps) => {
  const { resourceType: type, total } = resource;
  return (
    <NavLink
      to={`/educators/resources/${
        resourcesDictionary[resource.resourceType].plural
      }`}
    >
      <div className="flex shadow-animated bg-white p-3 rounded-xl shadow-sm hover:bg-main-200 hover:cursor-pointer transition-all duration-200">
        <div className="flex items-center justify-center w-10 h-10 bg-main-400 rounded-xl text-white mr-4 p-3">
          {resourcesDictionary[type].icon}
        </div>
        <div className="flex-1">
          <h2>{resourcesDictionary[type].title}</h2>
          <p className="text-xs text-gray-500">
            {total} {resourcesDictionary[type].title.toLowerCase()} available
          </p>
        </div>
        <div className="flex-center">
          <ChevronRight className="text-main-400 h-5 w-5" />
        </div>
      </div>
    </NavLink>
  );
};
