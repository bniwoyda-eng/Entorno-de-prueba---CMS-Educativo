import { useState, useEffect } from "react";
import { ServerPaginatedTable } from "../../../../components/ServerPaginatedTable";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Modal } from "../../../../components";
import { useQuestionsPaginatedTableWithSearch } from "../../hooks/questions.hooks";
import { IQuestionAnswers } from "../../interfaces/questions.interfaces";
import { QuestionCreateModal } from "../../components/QuestionCreateModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
});

export const QuestionBank = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { register, watch } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const search = watch("search");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Implementar debounce correctamente
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { isLoading, tableProps } = useQuestionsPaginatedTableWithSearch({
    initialPage: 1,
    initialRowsPerPage: 15,
    search: debouncedSearch,
  });

  const handleRowClick = (row: IQuestionAnswers) => {
    navigate(`/admin/question-bank/${row.id}`);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="page-base">
      <div className="flex justify-between items-center mb-2">
        <Breadcrumb
          items={[
            { label: "Question Bank" },
          ]}
        />
        <button className="btn-primary" onClick={handleCreate}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Question
        </button>
      </div>
      
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search questions..."
          className="form-control py-2 text-sm"
          {...register("search")}
        />
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading questions...</div>
          </div>
        ) : (
          <ServerPaginatedTable<IQuestionAnswers>
            {...tableProps}
            columns={[
              // { key: "id", label: "ID" },
              { key: "questionText", label: "Question" },
              { key: "maxScore", label: "Max Score" },
              {
                key: "answerOptions",
                label: "Options",
                render: (row) => row.answerOptions?.length || 0,
              },
            ]}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* Modal para crear pregunta */}
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseModal} size="lg">
        <Modal.Header>Create New Question</Modal.Header>
        <Modal.Body>
          <QuestionCreateModal onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};
