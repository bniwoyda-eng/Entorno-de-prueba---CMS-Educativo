import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAssessment } from "../../admin/hooks/assessments.hooks";
import { Breadcrumb, SelfAssessment } from "../../../components";

export const SelfAssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>No assessment ID provided</div>;
  }

  const { data: assessment, isError } = useAssessment(id);

  // Handle assessment not found error and redirect
  useEffect(() => {
    if (isError) {
      navigate("/students/self-assessments", { replace: true });
    }
  }, [isError, navigate]);

  // Loading state while fetching
  if (!assessment && !isError) {
    return <div>Loading assessment...</div>;
  }

  // If error occurred, component will redirect via useEffect
  if (isError) {
    return null;
  }

  return (
    <div className="page-base">
      <Breadcrumb
        items={[
          { label: "Self Assessments", to: "/students/self-assessments" },
          { label: assessment.title },
        ]}
      />
      <SelfAssessment assessmentId={id} />
    </div>
  );
};
