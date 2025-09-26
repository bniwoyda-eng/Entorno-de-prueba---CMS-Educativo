import { Breadcrumb, LoadingComponent } from "../../../components";
import { AssessmentCard } from "../../admin/components";
import { useAssessments } from "../../admin/hooks/assessments.hooks";

export const SelfAssessmentsPage = () => {
  const { isLoading, data: assessments } = useAssessments();
  return (
    <div className="page-base">
      <Breadcrumb items={[{ label: "Self Assessments" }]} />
      
      <div className="min-h-[200px]">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assessments?.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>

            {assessments?.length === 0 && (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg border shadow-sm">
                <p className="text-gray-500">
                  No assessments found with the current filters. Try changing
                  the filters or creating a new assessment.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
