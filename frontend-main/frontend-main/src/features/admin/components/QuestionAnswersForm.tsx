import { SaveIcon, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useQuestion,
  useUpdateQuestion,
  useCreateQuestion,
  useDeleteQuestion,
} from "../hooks/questions.hooks";
import { useForm } from "react-hook-form";
import { CreateQuestionSchema } from "../schemas/questions.schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CustomAlert } from "../../../utils";
interface QuestionFormProps {
  editingId?: string;
}
export const QuestionAnswersForm = ({ editingId }: QuestionFormProps) => {
  const navigate = useNavigate();
  const isEditing = Boolean(editingId);

  const { data: question, isLoading: isLoadingQuestion } =
    useQuestion(editingId);
  const { mutate: updateQuestion, isPending: isUpdatingQuestion } =
    useUpdateQuestion();
  const { mutate: createQuestion, isPending: isCreatingQuestion } =
    useCreateQuestion();
  const { mutate: deleteQuestion, isPending: isDeletingQuestion } =
    useDeleteQuestion();

  const isPending =
    isUpdatingQuestion ||
    isCreatingQuestion ||
    isLoadingQuestion ||
    isDeletingQuestion;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateQuestionSchema>>({
    resolver: zodResolver(CreateQuestionSchema),
    defaultValues: {
      questionText: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CreateQuestionSchema>) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Confirm",
      description: "Are you sure you want to save this question?",
    });
    if (!isConfirmed) return;
    if (isEditing && editingId) {
      updateQuestion({ id: editingId, dto: data });
    } else {
      try {
        createQuestion(data, {
          onSuccess: (data: any) => {
            reset();
            CustomAlert.toast("success", "Question created successfully");
            if (data) {
              navigate(`/admin/self-assessments/question-bank/${data.id}`);
            }
          },
          onError: () => {
            CustomAlert.toast("error", "Error creating question");
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async () => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Confirm",
      description: "Are you sure you want to delete this question?",
    });
    if (!isConfirmed || !editingId) return;
    deleteQuestion(editingId, {
      onSuccess: () => {
        CustomAlert.toast("success", "Question deleted successfully");
        navigate("/admin/self-assessments/question-bank");
      },
      onError: () => {
        CustomAlert.toast("error", "Error deleting question");
      },
    });
  };

  useEffect(() => {
    if (isEditing && question) {
      reset({
        questionText: question.questionText,
      });
    }
  }, [isEditing, question, reset]);

  return (
    <div className="card">
      <h1 className="card-title mb-2">
        {isEditing ? "Edit Question" : "Create Question"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-2">
          <div className="space-y-1">
            <label htmlFor="questionText">Question Text</label>
            <input
              disabled={isPending}
              type="text"
              className="form-control"
              {...register("questionText")}
              placeholder="Question Text"
            />
            {errors.questionText && (
              <p className="text-red-500 text-sm">
                {errors.questionText.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {isEditing && (
            <button
              type="button"
              className="btn-primary bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            <SaveIcon className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
