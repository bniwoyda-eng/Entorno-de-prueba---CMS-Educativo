import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../../../components";
import { QuestionImage, AnswerOptionsForm, QuestionForm } from "../../components";
import { useQuestion } from "../../hooks/questions.hooks";

export const QuestionEdit = () => {
  const { id } = useParams();

  const { data: question } = useQuestion(id);

  if (!id) {
    return <div>Question not found</div>;
  }

  return (
    <div className="page-base">
      <Breadcrumb
        items={[
          { label: "Question Bank", to: "/admin/question-bank" },
          { label: question?.questionText || "Question" },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <QuestionForm editingId={id} />
          <AnswerOptionsForm questionId={id} />
        </div>
        <div className="col-span-1">
          <QuestionImage questionId={id} />
        </div>
      </div>
    
    </div>
  );
};
