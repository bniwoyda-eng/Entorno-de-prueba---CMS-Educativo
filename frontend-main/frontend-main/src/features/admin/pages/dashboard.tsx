import { ClockFading } from "lucide-react";
import { AssessmentAttemptsChart } from "../components";

export const Dashboard = () => {
  return (
    <div className="page-base h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-4 h-full">
        <div className="col-span-1 gap-4">
          <AssessmentAttemptsChart />
        </div>
        <div className="col-span-1 gap-4 card flex-center text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <ClockFading className="w-10 h-10" />
            <h1 className="text-2xl font-medium">Next Feature</h1>
            <p className="text-sm text-gray-500">
              On this section you can see the activity of the students.
            </p>
          </div>
        </div>
        <div className="col-span-1 gap-4 card flex-center text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <ClockFading className="w-10 h-10" />
            <h1 className="text-2xl font-medium">Next Feature</h1>
            <p className="text-sm text-gray-500">
              On this section you can see the activity of the students.
            </p>
          </div>
        </div>
        <div className="col-span-1 gap-4 card flex-center text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <ClockFading className="w-10 h-10" />
            <h1 className="text-2xl font-medium">Next Feature</h1>
            <p className="text-sm text-gray-500">
              On this section you can see the platform statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
