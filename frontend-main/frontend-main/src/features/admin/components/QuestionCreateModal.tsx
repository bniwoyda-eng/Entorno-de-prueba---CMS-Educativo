import { SaveIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateQuestion } from "../hooks/questions.hooks";
import { useForm } from "react-hook-form";
import { CreateQuestionSchema } from "../schemas/questions.schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomAlert } from "../../../utils";

interface QuestionCreateModalProps {
  onClose: () => void;
}

export const QuestionCreateModal = ({ onClose }: QuestionCreateModalProps) => {
  const navigate = useNavigate();
  const { mutate: createQuestion, isPending: isCreatingQuestion } =
    useCreateQuestion();

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
    createQuestion(data, {
      onSuccess: (data: any) => {
        reset();
        CustomAlert.toast("success", "Question created successfully");
        onClose();
        if (data?.id) {
          navigate(`/admin/self-assessments/question-bank/${data.id}`);
        }
      },
      onError: () => {
        CustomAlert.toast("error", "Error creating question");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="questionText" className="block text-sm font-medium mb-2">
          Question Text
        </label>
        <input
          disabled={isCreatingQuestion}
          type="text"
          className="form-control w-full"
          {...register("questionText")}
          placeholder="Enter question text..."
        />
        {errors.questionText && (
          <p className="text-red-500 text-sm mt-1">
            {errors.questionText.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={isCreatingQuestion}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isCreatingQuestion}
        >
          <SaveIcon className="w-4 h-4 mr-2" />
          {isCreatingQuestion ? "Creating..." : "Create Question"}
        </button>
      </div>
    </form>
  );
}; 