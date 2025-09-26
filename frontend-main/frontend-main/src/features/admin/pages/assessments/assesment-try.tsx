import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Breadcrumb, SelfAssessment } from "../../../../components";
import { useAssessment } from "../../hooks/assessments.hooks";

export const AssesmentTry = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>No assessment ID provided</div>;
  }

  const { data: assessment, isError } = useAssessment(id);

  // Handle assessment not found error and redirect
  useEffect(() => {
    if (isError) {
      navigate("/admin/self-assessments", { replace: true });
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
          { label: "Self Assessments", to: "/admin/self-assessments" },
          { label: assessment.title, to: `/admin/self-assessments/${id}` },
          { label: "Try assessment" },
        ]}
      />
      <SelfAssessment assessmentId={id} />
    </div>
  );
};
