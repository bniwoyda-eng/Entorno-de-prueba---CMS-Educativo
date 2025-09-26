import { NavLink } from "react-router-dom";
import { RadialProgress, FlickingCarousel } from "../../../components";
import { useCalendarEvents, useResources } from "../api/educators.queries";
import { resourcesDictionary } from "../types";
import { differenceInDays, format, getHours, getMinutes } from "date-fns";

export const Home = () => {
  const { data: resources, isLoading: isLoadingResources } = useResources();
  const { data: calendarEvents, isLoading: isLoadingCalendarEvents } =
    useCalendarEvents({
      filter: "all",
      incoming: true,
    });
  return (
    <div className="page-base">
      <img
        src="/banner-educator.png"
        alt="Banner"
        className="w-full rounded-xl object-cover hidden xl:block mb-4 shadow h-24"
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* IZQ */}
        <div className="col-span-1 xl:col-span-2 gap-4">
          <div className="bg-white p-4 rounded-xl mb-4">
            <h2 className="text-lg font-medium mb-2">Students progress</h2>
            <div className="flex items-center justify-center space-x-8">
              <RadialProgress
                value={70}
                displayValue="70%"
                label="Activities"
                color="#ef4444"
              />
              <RadialProgress
                value={75}
                displayValue="7,5 h"
                label="Hours Spent"
                color="#8b5cf6"
              />
              <RadialProgress
                value={70}
                displayValue="70%"
                label="Learn Progress"
                color="#0ea5e9"
              />
            </div>
            <p className="mt-3 text-xs text-center">
              Your student's average activity this week is{" "}
              <span className="font-medium">90%</span>, which is{" "}
              <span className="font-medium">excellent.</span>
            </p>
          </div>

          <div className="mt-6 mb-8">
            {isLoadingResources ? (
              <div className="w-full h-44 flex-center">
                <div className="loader"></div>
              </div>
            ) : (
              <FlickingCarousel title="Resources" href="/educators/resources">
                {resources?.data.slice().reverse().map((resource, index) => (
                  <NavLink
                    key={index}
                    to={`/educators/resources/${
                      resourcesDictionary[resource.resourceType].plural
                    }/${resource.id}`}
                  >
                    <div className="w-64 h-48 mx-2 bg-white rounded-xl overflow-hidden">
                      <img
                        src={resource.thumbnailUrl}
                        alt={resource.title}
                        title={resource.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="px-4 py-3">
                        <p
                          className="text-sm line-clamp-2"
                          title={resource.title}
                        >
                          {resource.title}
                        </p>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </FlickingCarousel>
            )}
          </div>
          <div>
            {isLoadingResources ? (
              <div className="w-full h-44 flex-center">
                <div className="loader"></div>
              </div>
            ) : (
              <FlickingCarousel title="Resources" href="/educators/resources">
                {resources?.data.map((resource, index) => (
                  <NavLink
                    key={index}
                    to={`/educators/resources/${
                      resourcesDictionary[resource.resourceType].plural
                    }/${resource.id}`}
                  >
                    <div className="w-64 h-48 mx-2 bg-white rounded-xl overflow-hidden">
                      <img
                        src={resource.thumbnailUrl}
                        alt={resource.title}
                        title={resource.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="px-4 py-3">
                        <p
                          className="text-sm line-clamp-2"
                          title={resource.title}
                        >
                          {resource.title}
                        </p>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </FlickingCarousel>
            )}
          </div>
        </div>

        {/* DER */}
        <div className="col-span-1 gap-4">
          <div className="bg-white p-4 rounded-xl mb-4">
            <h2 className="text-lg font-medium mb-2">Notifications</h2>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 mb-3  py-2 px-4 bg-main-50 rounded-xl"
              >
                <input
                  type="radio"
                  className="w-4 h-4 text-main-500 border-gray-300 rounded focus:ring-main-500 me-2"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    Notification description
                  </span>
                  <span className="text-gray-500 text-xs">Course 1.1</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[20px] p-5 flex flex-col">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">Incoming events</p>
              <NavLink
                to="/educators/events"
                className="text-sm text-main-300 hover:text-main-500"
              >
                View all
              </NavLink>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 mt-4">
                {isLoadingCalendarEvents ? (
                  <div className="w-full h-44 flex-center">
                    <div className="loader"></div>
                  </div>
                ) : (
                  calendarEvents?.data.slice(0, 3).map((event, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1 flex flex-col gap-1">
                        <h2 className="text">{event.title}</h2>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {event.description}
                        </p>
                        <small className="text-main-400">
                          {format(event.startDate, "dd/MM/yyyy HH:mm")}

                          {differenceInDays(event.endDate, event.startDate) >
                          0 ? (
                            <> - {format(event.endDate, "dd/MM/yyyy HH:mm")}</>
                          ) : getHours(event.endDate) >
                              getHours(event.startDate) ||
                            getMinutes(event.endDate) >
                              getMinutes(event.startDate) ? (
                            <> - {format(event.endDate, "HH:mm")}</>
                          ) : null}
                        </small>
                      </div>
                      {event.bannerUrl ? (
                        <img
                          src={
                            event.bannerUrl || "https://placehold.co/100x100"
                          }
                          alt={event.title}
                          className="h-20 object-cover rounded-[20px] shrink-0 max-w-20"
                        />
                      ) : (
                        <div className="w-20 h-20 ">
                          {/* <span className="text-gray-500">No Image</span> */}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
