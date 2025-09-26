import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAssessments,
  useAssessmentCategories,
} from "../../hooks/assessments.hooks";
import { AssessmentCard, AssessmentForm } from "../../components";
import { Breadcrumb, LoadingComponent, Modal } from "../../../../components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AssessmentFilters } from "../../services/assessments.service";

const filtersSchema = z.object({
  search: z.string().optional(),
  isActive: z.string().optional(),
  categoryId: z.string().optional(),
  sortOrder: z.string().optional(),
});

export const Assessments = () => {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { register, watch } = useForm({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      search: "",
      isActive: "",
      categoryId: "",
      sortOrder: "DESC",
    },
  });

  const search = watch("search");
  const isActive = watch("isActive");
  const categoryId = watch("categoryId");
  const sortOrder = watch("sortOrder");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Implementar debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Construir filtros
  const filters: AssessmentFilters = {};
  if (debouncedSearch) filters.search = debouncedSearch;
  if (isActive && isActive !== "") filters.isActive = isActive === "true";
  if (categoryId && categoryId !== "") filters.categoryId = categoryId;
  
  // Always include sorting, default to newest first
  filters.sortBy = "created_at";
  filters.sortOrder = (sortOrder as "ASC" | "DESC") || "DESC";

  const { data: assessments, isLoading } = useAssessments(
    Object.keys(filters).length > 0 ? filters : undefined
  );
  const { data: categories } = useAssessmentCategories();

  const handleView = (assessmentId: string) => {
    navigate(`${assessmentId}`);
  };

  const handleClose = () => {
    setCreateModalOpen(false);
  };

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  return (
    <div className="page-base">
      <div className="flex gap-3 flex-col md:flex-row justify-between items-center mb-4">
        <Breadcrumb items={[{ label: "Self Assessments" }]} />

        <div className="flex gap-3">
          <button className="btn-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Assessment
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda por texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title or description..."
              className="form-control py-2 text-sm"
              {...register("search")}
            />
          </div>

          {/* Filtro por visibilidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              className="form-control py-2 text-sm"
              {...register("isActive")}
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="form-control py-2 text-sm"
              {...register("categoryId")}
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by Date
            </label>
            <select
              className="form-control py-2 text-sm"
              {...register("sortOrder")}
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección de resultados */}
      <div className="min-h-[200px]">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assessments?.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  onEdit={() => handleView(assessment.id)}
                />
              ))}
            </div>

            {assessments?.length === 0 && (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg border shadow-sm">
                <p className="text-gray-500">
                  No assessments found with the current filters. Try changing the
                  filters or creating a new assessment.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={createModalOpen} onClose={handleClose} size="lg">
        <Modal.Header>Create Assessment</Modal.Header>
        <Modal.Body>
          <AssessmentForm onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
};
