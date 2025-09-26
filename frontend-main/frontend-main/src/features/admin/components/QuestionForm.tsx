import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, Trash, EditIcon, Info } from "lucide-react";
import { useQuestion, useUpdateQuestion, useDeleteQuestion } from "../hooks/questions.hooks";
import { CreateQuestionSchema } from "../schemas/questions.schemas";
import { CustomAlert } from "../../../utils";

interface QuestionFormProps {
  editingId: string;
}

export const QuestionForm = ({ editingId }: QuestionFormProps) => {
  const navigate = useNavigate();
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);

  const { data: question, isLoading: isLoadingQuestion } =
    useQuestion(editingId);
  const { mutate: updateQuestion, isPending: isUpdatingQuestion } =
    useUpdateQuestion();
  const { mutate: deleteQuestion, isPending: isDeletingQuestion } =
    useDeleteQuestion();

  const isPending =
    isUpdatingQuestion || isLoadingQuestion || isDeletingQuestion;

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
      description: "Are you sure you want to update this question?",
    });
    if (!isConfirmed) return;

    updateQuestion(
      { id: editingId, dto: data },
      {
        onSuccess: () => {
          CustomAlert.toast("success", "Question updated successfully");
          setIsEditingEnabled(false);
        },
        onError: () => {
          CustomAlert.toast("error", "Error updating question");
        },
      }
    );
  };

  const handleDelete = async () => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Confirm",
      description: "Are you sure you want to delete this question?",
    });
    if (!isConfirmed) return;

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

  const handleEnableEditing = () => {
    setIsEditingEnabled(true);
  };

  const handleCancelEditing = () => {
    setIsEditingEnabled(false);
    // Reset form to original values
    if (question) {
      reset({
        questionText: question.questionText,
      });
    }
  };

  useEffect(() => {
    if (question) {
      reset({
        questionText: question.questionText,
      });
    }
  }, [question, reset]);

  // Determine if fields should be disabled
  const fieldsDisabled = isPending || !isEditingEnabled;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h1 className="card-title flex items-center">
          <Info className="w-4 h-4 mr-2 inline-block" />
          {isEditingEnabled ? "Edit Question" : "Question Information"}
        </h1>

        {/* Enable editing button */}
        {!isEditingEnabled && (
          <button
            type="button"
            className="btn-primary"
            onClick={handleEnableEditing}
            disabled={isPending}
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Enable Editing
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1 text-sm">
          <label htmlFor="questionText">Question Text</label>
          <input
            disabled={fieldsDisabled}
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

        {/* Action buttons - only show when editing is enabled */}
        {isEditingEnabled && (
          <div className="mt-4 flex justify-end gap-2">
            {/* Cancel button */}
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancelEditing}
              disabled={isPending}
            >
              Cancel
            </button>

            {/* Delete button */}
            <button
              type="button"
              className="btn-primary bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </button>

            {/* Save button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
