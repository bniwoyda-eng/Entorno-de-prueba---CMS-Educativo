import { useState } from "react";
import {
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  EditIcon,
  ListCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAssessmentAnswerOptionByQuestionId,
  useCreateAssessmentAnswerOptionForQuestion,
  useUpdateAssessmentAnswerOptionForQuestion,
  useDeleteAssessmentAnswerOptionForQuestion,
} from "../hooks/assessment-answer-options.hooks";
import { CreateQuestionOptionSchema } from "../schemas/questions.schemas";
import { IQuestionAnswerOption } from "../interfaces/questions.interfaces";
import { CustomAlert } from "../../../utils";

interface AnswerOptionsFormProps {
  questionId: string;
}

interface AnswerOptionFormData {
  answerText: string;
  score: number;
}

export const AnswerOptionsForm = ({ questionId }: AnswerOptionsFormProps) => {
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: answerOptions = [], isLoading } =
    useAssessmentAnswerOptionByQuestionId(questionId);
  const { mutate: createOption, isPending: isCreating } =
    useCreateAssessmentAnswerOptionForQuestion(questionId);
  const { mutate: updateOption, isPending: isUpdating } =
    useUpdateAssessmentAnswerOptionForQuestion(questionId);
  const { mutate: deleteOption, isPending: isDeleting } =
    useDeleteAssessmentAnswerOptionForQuestion(questionId);

  // Form for creating new options
  const createForm = useForm<AnswerOptionFormData>({
    resolver: zodResolver(CreateQuestionOptionSchema),
    defaultValues: {
      answerText: "",
      score: 0,
    },
  });

  const handleCreateOption = async (data: AnswerOptionFormData) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Create Option",
      description: "Are you sure you want to create this answer option?",
    });
    if (!isConfirmed) return;

    createOption(
      { id_question: questionId, option: data },
      {
        onSuccess: () => {
          CustomAlert.toast("success", "Answer option created successfully");
          createForm.reset();
          setShowCreateForm(false);
        },
        onError: () => {
          CustomAlert.toast("error", "Error creating answer option");
        },
      }
    );
  };

  const handleUpdateOption = async (
    optionId: string,
    data: AnswerOptionFormData
  ) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Update Option",
      description: "Are you sure you want to update this answer option?",
    });
    if (!isConfirmed) return;

    updateOption(
      { id: optionId, option: data },
      {
        onSuccess: () => {
          CustomAlert.toast("success", "Answer option updated successfully");
          setEditingOptionId(null);
        },
        onError: () => {
          CustomAlert.toast("error", "Error updating answer option");
        },
      }
    );
  };

  const handleDeleteOption = async (optionId: string) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Delete Option",
      description:
        "Are you sure you want to delete this answer option? This action cannot be undone.",
    });
    if (!isConfirmed) return;

    deleteOption(optionId, {
      onSuccess: () => {
        CustomAlert.toast("success", "Answer option deleted successfully");
      },
      onError: () => {
        CustomAlert.toast("error", "Error deleting answer option");
      },
    });
  };

  // Handle opening create form - close any editing form
  const handleOpenCreateForm = () => {
    setEditingOptionId(null); // Close any editing form
    setShowCreateForm(true);
  };

  // Handle opening edit form - close create form
  const handleOpenEditForm = (optionId: string) => {
    setShowCreateForm(false); // Close create form
    createForm.reset(); // Reset create form
    setEditingOptionId(optionId);
  };

  // Handle closing create form
  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    createForm.reset();
  };

  // Handle closing edit form
  const handleCloseEditForm = () => {
    setEditingOptionId(null);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading answer options...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="card-title flex items-center">
          <ListCheck className="w-4 h-4 mr-2 inline-block" />
          Answer Options
        </h2>
        <button
          onClick={handleOpenCreateForm}
          className="btn-primary"
          disabled={isCreating}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Option
        </button>
      </div>

      {/* No options message */}
      {answerOptions.length === 0 && !showCreateForm && (
        <div className="text-center py-8 text-gray-500">
          <p>No answer options found for this question.</p>
          <p className="text-sm mt-2">
            Click "Add Option" to create the first option.
          </p>
        </div>
      )}

      {/* Create form */}
      {showCreateForm && (
        <div className="border border-green-200 rounded-lg p-3 mb-4 bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2">
            Create New Option
          </h3>
          <form
            onSubmit={createForm.handleSubmit(handleCreateOption)}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer Text
                </label>
                <input
                  type="text"
                  {...createForm.register("answerText")}
                  className="form-control"
                  placeholder="Enter answer text"
                  disabled={isCreating}
                />
                {createForm.formState.errors.answerText && (
                  <p className="text-red-500 text-sm mt-1">
                    {createForm.formState.errors.answerText.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2 items-end">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    {...createForm.register("score", { valueAsNumber: true })}
                    className="form-control"
                    placeholder="Enter score"
                    min="0"
                    disabled={isCreating}
                  />
                  {createForm.formState.errors.score && (
                    <p className="text-red-500 text-sm mt-1">
                      {createForm.formState.errors.score.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 items-end">
                  <button
                    type="submit"
                    className="btn-primary py-2"
                    disabled={isCreating}
                  >
                    <SaveIcon className="w-4 h-4 mr-2" />
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseCreateForm}
                    className="btn-secondary py-2"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Existing options */}
      <div className="space-y-3">
        {answerOptions.map((option) => (
          <AnswerOptionItem
            key={option.id}
            option={option}
            isEditing={editingOptionId === option.id}
            onEdit={() => handleOpenEditForm(option.id)}
            onCancelEdit={handleCloseEditForm}
            onUpdate={(data) => handleUpdateOption(option.id, data)}
            onDelete={() => handleDeleteOption(option.id)}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </div>
  );
};

// Individual option component
interface AnswerOptionItemProps {
  option: IQuestionAnswerOption;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (data: AnswerOptionFormData) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const AnswerOptionItem = ({
  option,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: AnswerOptionItemProps) => {
  const editForm = useForm<AnswerOptionFormData>({
    resolver: zodResolver(CreateQuestionOptionSchema),
    defaultValues: {
      answerText: option.answerText,
      score: option.score,
    },
  });

  if (isEditing) {
    return (
      <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
        <h4 className="font-semibold text-blue-800 mb-2">Edit Option</h4>
        <form onSubmit={editForm.handleSubmit(onUpdate)} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer Text
              </label>
              <input
                type="text"
                {...editForm.register("answerText")}
                className="form-control"
                disabled={isUpdating}
              />
              {editForm.formState.errors.answerText && (
                <p className="text-red-500 text-sm mt-1">
                  {editForm.formState.errors.answerText.message}
                </p>
              )}
            </div>
            <div className="flex gap-2 items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score
                </label>
                <input
                  type="number"
                  {...editForm.register("score", { valueAsNumber: true })}
                  className="form-control"
                  min="0"
                  disabled={isUpdating}
                />
                {editForm.formState.errors.score && (
                  <p className="text-red-500 text-sm mt-1">
                    {editForm.formState.errors.score.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2 items-end">
                <button
                  type="submit"
                  className="btn-primary py-2"
                  disabled={isUpdating}
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  {isUpdating ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="btn-secondary py-2"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-medium text-gray-900">
              {option.answerText}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              Score: {option.score}
            </span>
          </div>
          <div className="text-xs text-gray-500">ID: {option.id}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            disabled={isUpdating || isDeleting}
            title="Edit option"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            disabled={isUpdating || isDeleting}
            title="Delete option"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
