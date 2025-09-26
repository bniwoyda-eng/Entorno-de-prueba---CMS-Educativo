import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useAssessment,
  useDeleteAssessment,
} from "../../hooks/assessments.hooks";
import {
  Breadcrumb,
  GradientBar,
  ImageWithFallback,
  LoadingComponent,
  Modal,
} from "../../../../components";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { AssessmentForm, VisibilityBadge } from "../../components";
import {
  useAssessmentRiskSegmentsByAssessmentId,
  useCreateManyAssessmentRiskSegments,
} from "../../hooks/assessment-risk-segments.hooks";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiskSegmentBatchSchema } from "../../schemas/assessment-risk-segments.schemas";
import { z } from "zod";
import {
  Info,
  Lock,
  Pencil,
  Plus,
  Save,
  Trash,
  Unlock,
  GripVertical,
  Minus,
  Eye,
  Target,
  Rocket,
} from "lucide-react";
import { CustomAlert } from "../../../../utils";
import {
  useCreateQuestionPivot,
  useDeleteQuestionPivot,
  useQuestionPivots,
  useReorderQuestionPivots,
} from "../../hooks/question-pivots.hooks";
import {
  useAvailableQuestions,
  useQuestion,
} from "../../hooks/questions.hooks";

export const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return <Navigate to="/admin/self-assessments" />;

  const handleTryAssessment = () => {
    navigate(`/admin/self-assessments/${id}/try`);
  };

  const { data: assessment, isError } = useAssessment(id);

  // Handle assessment not found error and redirect
  useEffect(() => {
    if (isError) {
      navigate("/admin/self-assessments", { replace: true });
    }
  }, [isError, navigate]);

  // Loading state while fetching
  if (!assessment && !isError) {
    return (
      <div className="page-base">
        <div>Loading assessment...</div>
      </div>
    );
  }

  // If error occurred, component will redirect via useEffect
  if (isError) {
    return null;
  }

  return (
    <div className="page-base">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb
          items={[
            { label: "Self Assessments", to: "/admin/self-assessments" },
            { label: assessment?.title || "Assessment" },
          ]}
        />
        <button className="btn-primary" onClick={handleTryAssessment}>
          <Rocket className="w-4 h-4 mr-1" />
          Try assessment
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <MainInfo id={id} />
        <RiskSegments id={id} />
        <Questions id={id} />
        <AvailableQuestions id={id} />
      </div>
    </div>
  );
};

const MainInfo = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { data: assessment, isLoading } = useAssessment(id);
  const { mutate: deleteAssessment, isPending: isDeleting } =
    useDeleteAssessment();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setCreateModalOpen(false);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setCreateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Confirm",
      description: "Are you sure you want to delete this assessment?",
    });
    if (!isConfirmed) return;
    deleteAssessment(id, {
      onSuccess: () => {
        CustomAlert.toast("success", "Assessment deleted successfully");
        navigate("/admin/self-assessments");
      },
      onError: () => {
        CustomAlert.toast("error", "Error deleting assessment");
      },
    });
  };
  if (isLoading || !assessment) return <LoadingComponent />;

  return (
    <Fragment>
      <div className="card h-full text-sm">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 className="card-title">Information</h2>
          <div className="flex items-center gap-2">
            <button
              className="btn-primary text-sm py-0 px-2"
              onClick={() => handleEdit(assessment.id)}
              title="Edit information"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit information
            </button>
            <button
              className="btn-secondary border text-sm py-0 px-2"
              disabled={isDeleting}
              onClick={() => handleDelete(assessment.id)}
              title="Delete assessment"
            >
              <Trash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <p className="font-medium">ID:</p>
            <p>{assessment?.id}</p>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">Title:</p>
            <p className="font-semibold">{assessment?.title}</p>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">Description:</p>
            <p>{assessment?.description}</p>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">Category:</p>
            <span className="badge-main">
              {assessment?.assessmentCategory?.name}
            </span>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">Visibility:</p>
            <VisibilityBadge isActive={assessment?.isActive} />
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium">Gradient:</p>
            <span>
              {AssessmentGradientLabels[assessment?.gradient]}
            </span>
          </div>
        </div>
      </div>
      <Modal isOpen={createModalOpen} onClose={handleClose} size="lg">
        <Modal.Header>Edit Assessment</Modal.Header>
        <Modal.Body>
          <AssessmentForm editingId={editingId} onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

const RiskSegments = ({ id }: { id: string }) => {
  const { data: assessment } = useAssessment(id);

  const { data: riskSegments, isLoading } =
    useAssessmentRiskSegmentsByAssessmentId(id);

  const { mutate: createMany, isPending: isCreatingMany } =
    useCreateManyAssessmentRiskSegments();

  const [isEditing, setIsEditing] = useState(false);
  const [initialSegments, setInitialSegments] = useState<
    z.infer<typeof RiskSegmentBatchSchema>
  >({ riskSegments: [] });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(RiskSegmentBatchSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "riskSegments",
  });

  useEffect(() => {
    if (riskSegments) {
      const formatted = riskSegments.map((segment) => ({
        id: segment.id, // 👈 importante para upsert
        minScore: segment.minScore,
        maxScore: segment.maxScore,
        recommendations: segment.recommendations,
      }));

      setInitialSegments({ riskSegments: formatted });
      reset({ riskSegments: formatted });
    }
  }, [riskSegments, reset]);

  // Restaurar valores originales si se cancela la edición
  const handleToggleEdit = () => {
    if (isEditing) {
      reset({ riskSegments: initialSegments.riskSegments });
    }
    setIsEditing((prev) => !prev);
  };

  if (isLoading || !riskSegments) return <LoadingComponent />;

  const onSubmit = async (data: z.infer<typeof RiskSegmentBatchSchema>) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Confirm",
      description: "Are you sure you want to save the segments?",
    });
    if (!isConfirmed) return;
    try {
      createMany({ assessmentId: id, dto: data.riskSegments });
      setInitialSegments({ riskSegments: data.riskSegments });
      setIsEditing(false);
      CustomAlert.toast("success", "Segments saved successfully");
    } catch (error) {
      console.error(error);
      CustomAlert.toast("error", "Error saving segments");
    }
  };

  return (
    <Fragment>
      <div className="card h-full">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 className="card-title">Score segments</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-secondary text-sm py-0 px-2"
              onClick={handleToggleEdit}
              disabled={isCreatingMany}
            >
              {isEditing ? (
                <Lock className="w-4 h-4 mr-1" />
              ) : (
                <Unlock className="w-4 h-4 mr-1" />
              )}
              {isEditing ? "Disable editing" : "Enable editing"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn-primary text-sm py-0 px-2"
                title="Add risk segment"
                disabled={isCreatingMany}
                onClick={() =>
                  append({
                    minScore: 0,
                    maxScore: 0,
                    recommendations: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add segment
              </button>
            )}
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="flex-center p-5">
            <Info className="w-4 h-4 mr-1 text-gray-500" />
            <p className="text-center text-gray-500">
              No score segments found for this assessment.
            </p>
          </div>
        ) : (
          <div>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* labels */}
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium w-24">Min score</p>
                <p className="text-sm font-medium w-24">Max score</p>
                <p className="text-sm font-medium">Recommendations</p>
              </div>
              <div className="flex gap-2 flex-1 min-h-0">
                {assessment && assessment.gradient !== "not_defined" && (
                  <div>
                    <GradientBar
                      gradient={assessment.gradient}
                      direction="vertical"
                    />
                  </div>
                )}

                <div className="flex-[2] overflow-y-auto">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          disabled={!isEditing || isCreatingMany}
                          className="form-control py-1 text-sm w-24 text-center"
                          {...register(`riskSegments.${index}.minScore`, {
                            valueAsNumber: true,
                          })}
                        />
                        <input
                          type="number"
                          disabled={!isEditing || isCreatingMany}
                          className="form-control py-1 text-sm w-24 text-center"
                          {...register(`riskSegments.${index}.maxScore`, {
                            valueAsNumber: true,
                          })}
                        />
                        <textarea
                          rows={1}
                          disabled={!isEditing || isCreatingMany}
                          className="form-control py-1 text-sm"
                          {...register(`riskSegments.${index}.recommendations`)}
                        />
                        {isEditing && (
                          <button
                            type="button"
                            className="btn-secondary text-sm py-1 px-2"
                            title="Delete segment"
                            onClick={() => remove(index)}
                            disabled={isCreatingMany}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs mt-1">
                        {errors.riskSegments?.[index]?.minScore && (
                          <p className="text-red-500">
                            {errors.riskSegments[index].minScore.message}
                          </p>
                        )}
                        {errors.riskSegments?.[index]?.maxScore && (
                          <p className="text-red-500">
                            {errors.riskSegments[index].maxScore.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="btn-primary self-end"
                  disabled={isCreatingMany}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save segments
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </Fragment>
  );
};

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { AssessmentGradientLabels } from "../../enums";

// Modal component for question details
const QuestionDetailModal = ({
  questionId,
  isOpen,
  onClose,
}: {
  questionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { data: question, isLoading } = useQuestion(questionId || undefined);

  if (!isOpen || !questionId) return null;

  const handleNavigate = (questionId: string) => {
    navigate(`/admin/question-bank/${questionId}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>Question Details</Modal.Header>
      <Modal.Body>
        {isLoading || !question ? (
          <LoadingComponent />
        ) : (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Question Text:</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                {question.questionText}
              </p>
            </div>

            {question.questionImage && (
              <div>
                <h3 className="font-semibold mb-2">Question Image:</h3>
                <ImageWithFallback
                  src={question.questionImage}
                  alt="Question"
                  className="max-w-full h-40 object-cover rounded-md"
                />
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">
                Max Score:{" "}
                <span className="text-blue-600">{question.maxScore}</span>
              </h3>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Answer Options:</h3>
              {question.answerOptions.length === 0 ? (
                <p className="text-gray-500 italic">
                  No answer options available
                </p>
              ) : (
                <div className="space-y-2">
                  {question.answerOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className="bg-gray-50 p-3 rounded-md border"
                    >
                      <div className="flex justify-between items-start">
                        <p className="flex-1 text-gray-700">
                          <span className="font-medium text-blue-600 mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option.answerText}
                        </p>
                        <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                          {option.score} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {question && (
          <div className="flex justify-end">
            <button
              className="btn-primary"
              onClick={() => handleNavigate(question.id)}
            >
              Go to question detail
            </button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

const SortableQuestion = ({ questionPivot, onDelete, onShowDetails }: any) => {
  if (!questionPivot) return null;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: questionPivot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se active el drag
    onDelete(questionPivot.id);
  };

  const handleShowDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se active el drag
    onShowDetails(questionPivot.question.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-gray-100 p-2 rounded-md flex items-center justify-between gap-2 hover:bg-gray-200 transition-colors shadow-sm"
    >
      <div className="flex items-center gap-2 flex-1">
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-300 rounded"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        <p
          className="flex-1 cursor-pointer text-sm hover:font-semibold transition-colors"
          onClick={handleShowDetailsClick}
        >
          <span className="text-gray-600 font-medium text-xs mr-2">
            [{questionPivot.order + 1}]
          </span>{" "}
          {questionPivot.question.questionText}
          <span className="text-gray-500 text-xs ml-2">
            {questionPivot.question.maxScore} pts
          </span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn-secondary border text-sm py-0 px-1"
          onClick={handleShowDetailsClick}
          title="View question details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="btn-secondary border text-sm py-0 px-1"
          onClick={handleDeleteClick}
          title="Delete question"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Questions = ({ id }: { id: string }) => {
  const { data: questionPivots, isLoading } = useQuestionPivots(id);
  const { mutate: deleteQuestionPivot } = useDeleteQuestionPivot();
  const { refetch: refetchAvailableQuestions } = useAvailableQuestions(id);
  const {
    mutate: updateQuestionPivotOrder,
    isPending: isUpdatingQuestionPivotOrder,
  } = useReorderQuestionPivots(id);

  const [items, setItems] = useState<string[]>([]); // questionPivot ids
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (questionPivots) {
      setItems(questionPivots.map((q) => q.id));
    }
  }, [questionPivots]);

  const handleDeleteQuestionPivot = async (id: string) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Confirm",
      description: "Are you sure you want to delete this question pivot?",
    });
    if (!isConfirmed) return;
    deleteQuestionPivot(id, {
      onSuccess: () => {
        setItems((prevItems) => prevItems.filter((itemId) => itemId !== id));
        CustomAlert.toast("success", "Question pivot deleted successfully");
        refetchAvailableQuestions();
      },
      onError: (error) => {
        console.error(error);
        CustomAlert.toast("error", "Error deleting question pivot");
      },
    });
  };

  const handleShowQuestionDetails = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedQuestionId(null);
    setIsDetailModalOpen(false);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Ahora reconstruimos el array actualizado con el nuevo orden
    const updatedPivots = newItems.map((id, index) => {
      const original = pivotMap[id];
      return {
        id: original.id,
        id_assessment: original.id_assessment,
        id_assessment_question: original.id_assessment_question,
        order: index,
      };
    });

    try {
      updateQuestionPivotOrder(updatedPivots, {
        onSuccess: () => {
          CustomAlert.toast("success", "Question order updated successfully");
        },
        onError: (error) => {
          console.error(error);
          CustomAlert.toast("error", "Error updating question order");
        },
      });
    } catch (error) {
      console.error(error);
      CustomAlert.toast("error", "Error updating question pivot order");
    }
  };

  if (isLoading || !questionPivots) return <LoadingComponent />;

  const pivotMap = Object.fromEntries(questionPivots.map((q) => [q.id, q]));

  return (
    <Fragment>
      <div className="card h-full">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 className="card-title">
            Assessment questions (total: {questionPivots.length})
          </h2>
        </div>
        {questionPivots.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 font-medium mb-4">
              <Target className="w-4 h-4 mr-1 inline-block" />
              Total score:{" "}
              {questionPivots.reduce(
                (acc, pivot) => acc + pivot.question.maxScore,
                0
              )}
              <span className="text-gray-500 text-xs ml-1">pts</span>
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                disabled={isUpdatingQuestionPivotOrder}
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col overflow-y-auto h-[400px] gap-2">
                  {items?.map((id) => (
                    <SortableQuestion
                      key={id}
                      questionPivot={pivotMap[id]}
                      onDelete={handleDeleteQuestionPivot}
                      onShowDetails={handleShowQuestionDetails}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        ) : (
          <div className="flex-center mt-10">
            <Info className="w-4 h-4 mr-1 text-gray-500" />
            <p className="text-center text-gray-500">
              No questions found for this assessment.
            </p>
          </div>
        )}
      </div>

      <QuestionDetailModal
        questionId={selectedQuestionId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </Fragment>
  );
};

const searchSchema = z.object({
  search: z.string().optional(),
});

const AvailableQuestions = ({ id }: { id: string }) => {
  const { data: questionPivots } = useQuestionPivots(id);
  const { mutate: createQuestionPivot } = useCreateQuestionPivot();

  const { register, watch } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const search = watch("search");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Implementar debounce correctamente
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || "");
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: availableQuestions, refetch: refetchAvailableQuestions } =
    useAvailableQuestions(id, debouncedSearch);

  const handleCreateQuestionPivot = async (questionId: string) => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Confirm",
      description: "Are you sure you want to add this question?",
    });
    if (!isConfirmed) return;
    createQuestionPivot(
      {
        id_assessment: id,
        id_assessment_question: questionId,
        order: questionPivots?.length || 0,
      },
      {
        onSuccess: () => {
          CustomAlert.toast("success", "Question pivot created successfully");
          refetchAvailableQuestions();
        },
        onError: (error) => {
          console.error(error);
          CustomAlert.toast("error", "Error creating question pivot");
        },
      }
    );
  };

  const handleShowQuestionDetails = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedQuestionId(null);
    setIsDetailModalOpen(false);
  };

  return (
    <Fragment>
      <div className="card h-full">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 className="card-title">
            Available questions (total: {availableQuestions?.length})
          </h2>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search questions..."
              className="form-control py-1 text-sm"
              {...register("search")}
            />
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto h-[400px] mt-4">
            {availableQuestions?.length === 0 ? (
              <div className="flex-center p-5">
                <Info className="w-4 h-4 mr-1 text-gray-500" />
                <p className="text-center text-gray-500">
                  No questions found matching your search.
                </p>
              </div>
            ) : (
              availableQuestions?.map((question) => (
                <div
                  key={question.id}
                  className="bg-gray-50 p-3 rounded-md flex items-center gap-2"
                >
                  <button
                    type="button"
                    className="btn-secondary border text-sm py-0 px-1"
                    onClick={() => handleCreateQuestionPivot(question.id)}
                    title="Add question"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="btn-secondary border text-sm py-0 px-1"
                    onClick={() => handleShowQuestionDetails(question.id)}
                    title="View question details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <p
                    className="text-sm flex-1 cursor-pointer hover:font-semibold transition-colors"
                    onClick={() => handleShowQuestionDetails(question.id)}
                  >
                    {question.questionText}
                    <span className="text-gray-500 text-xs ml-2">
                      {question.maxScore} pts
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </form>
      </div>

      <QuestionDetailModal
        questionId={selectedQuestionId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </Fragment>
  );
};
