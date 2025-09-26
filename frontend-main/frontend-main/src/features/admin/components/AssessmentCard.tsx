import { Eye, EyeOff, Rocket } from "lucide-react";
import { IAssessment } from "../interfaces/assessments.interfaces";
import { useAuthStore } from "../../auth/auth.store";
import { Roles } from "../../../constants/roles";
import { useNavigate } from "react-router-dom";

export const AssessmentCard = ({
  assessment,
  onEdit,
}: {
  assessment: IAssessment;
  onEdit?: () => void;
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  const isAdmin = user.roles.includes(Roles.ADMIN);

  const handleTakeAssessment = () => {
    navigate(`/students/self-assessments/${assessment.id}`);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex flex-col gap-2">
      <h1 className="text-lg font-semibold leading-tight border-b pb-2">
        {assessment.title}
      </h1>
      <p className="text-sm text-gray-500 h-full">{assessment.description}</p>
      {isAdmin ? (
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-100 rounded-lg px-2 py-1 w-fit">
              {assessment.assessmentCategory.name}
            </span>
            <VisibilityBadge isActive={assessment.isActive} />
          </div>
          <button className="btn-primary" onClick={onEdit}>
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-2 mt-1">
          <button className="btn-primary w-fit" onClick={handleTakeAssessment}>
            <Rocket className="w-4 h-4 mr-1" />
            Take Assessment
          </button>
        </div>
      )}
    </div>
  );
};

export const VisibilityBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <>
      {isActive ? (
        <span className="text-xs text-green-500 bg-green-100  rounded-lg px-2 py-1 w-fit">
          <Eye className="w-4 h-4 mr-1 inline" />
          Visible
        </span>
      ) : (
        <span className="text-xs text-red-500 bg-red-100  rounded-lg px-2 py-1 w-fit">
          <EyeOff className="w-4 h-4 mr-1 inline" />
          Hidden
        </span>
      )}
    </>
  );
};
