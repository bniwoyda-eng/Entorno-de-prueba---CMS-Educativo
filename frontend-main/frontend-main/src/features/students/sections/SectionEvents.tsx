export const SectionEvents = () => {
  return (
    <div className="bg-white rounded-[20px] p-5 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">Upcoming events</p>
        <span className="text-sm text-main-300">View all</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 mt-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div className="flex items-center gap-3" key={index}>
              <img
                src="https://placehold.co/100x100"
                alt="Event"
                className="h-[95px] object-cover rounded-[20px]"
              />
              <div className=" h-[95px] w-full">
                <h2 className="text-lg">How to Stay Safe Online</h2>
                <p className="text-sm text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vestibulum laoreet risus leo.
                </p>
                <small className="text-main-400">19 October, 10:30 AM</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
