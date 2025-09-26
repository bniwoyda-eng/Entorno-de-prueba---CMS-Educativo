import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAssessmentSchema } from "../schemas/assessments.schemas";
import {
  useAssessment,
  useCreateAssessment,
  useUpdateAssessment,
} from "../hooks/assessments.hooks";
import { useAssessmentCategories } from "../hooks/assessment-category.hooks";
import { CustomAlert } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { AssessmentGradient } from "../enums";

interface AssessmentFormProps {
  editingId?: string;
  onSuccess?: () => void;
}

export const AssessmentForm = ({
  editingId,
  onSuccess,
}: AssessmentFormProps) => {
  const navigate = useNavigate();
  const isEditing = Boolean(editingId);

  const { data: assessmentCategories, isLoading: isLoadingCategories } =
    useAssessmentCategories();
  const { data: assessment, isLoading: isLoadingAssessment } =
    useAssessment(editingId);
  const { mutate: updateAssessment, isPending: isUpdatingAssessment } =
    useUpdateAssessment();
  const { mutate: createAssessment, isPending: isCreatingAssessment } =
    useCreateAssessment();

  const isPending =
    isUpdatingAssessment ||
    isCreatingAssessment ||
    isLoadingAssessment ||
    isLoadingCategories;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateAssessmentSchema>>({
    resolver: zodResolver(CreateAssessmentSchema),
    defaultValues: {
      title: "",
      description: "",
      id_assessment_category: "",
      isActive: false,
      gradient: AssessmentGradient.not_defined,
    },
  });

  useEffect(() => {
    if (isEditing && assessment && assessmentCategories?.length) {
      reset({
        title: assessment.title,
        description: assessment.description,
        id_assessment_category: assessment.assessmentCategory.id,
        isActive: assessment.isActive,
        gradient: assessment.gradient,
      });
    }
  }, [assessment, assessmentCategories, isEditing, reset]);

  const onSubmit = async (data: z.infer<typeof CreateAssessmentSchema>) => {
    if (isEditing && editingId) {
      updateAssessment(
        { id: editingId, dto: data },
        {
          onSuccess: () => {
            onSuccess?.();
            reset();
            CustomAlert.toast("success", "Assessment updated successfully");
          },
          onError: () => {
            CustomAlert.toast("error", "Error updating assessment");
          },
        }
      );
    } else {
      createAssessment(data, {
        onSuccess: (data: any) => {
          onSuccess?.();
          reset();
          CustomAlert.toast("success", "Assessment created successfully");
          if (data) {
            navigate(`${data.id}`);
          }
        },
        onError: () => {
          CustomAlert.toast("error", "Error creating assessment");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="form-control"
            type="text"
            {...register("title")}
            disabled={isPending}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={5}
            className="form-control"
            {...register("description")}
            disabled={isPending}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="id_assessment_category">Category</label>
          <select
            id="id_assessment_category"
            className="form-control"
            {...register("id_assessment_category")}
            disabled={isPending}
          >
            <option value="">Select category</option>
            {assessmentCategories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.id_assessment_category && (
            <p className="text-red-500 text-sm">
              {errors.id_assessment_category.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="gradient">Gradient</label>
          <select
            id="gradient"
            className="form-control"
            {...register("gradient")}
            disabled={isPending}
          >
            <option value={AssessmentGradient.not_defined}>
              Not defined
            </option>
            <option value={AssessmentGradient.red_to_green}>
              Red to Green
            </option>
            <option value={AssessmentGradient.green_to_red}>
              Green to Red
            </option>
          </select>
          {errors.gradient && (
            <p className="text-red-500 text-sm">
              {errors.gradient.message}
            </p>
          )}
        </div>
        {isEditing && (
          <div className="flex gap-2 ml-1">
            <input id="isActive" type="checkbox" {...register("isActive")} />
            <label htmlFor="isActive">Mark as visible</label>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={onSuccess}
          disabled={isPending}
        >
          Cancel
        </button>

        <button type="submit" className="btn-primary" disabled={isPending}>
          {isEditing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};
