import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  Trophy,
  RotateCcw,
} from "lucide-react";

import { ButtonText } from "./buttons";
import { useAssessmentWithQuestions } from "../features/admin/hooks/assessments.hooks";
import {
  AssessmentService,
  AssessmentEvaluationResult,
} from "../features/admin/services/assessments.service";
import { IAssessmentWithQuestions } from "../features/admin/interfaces/assessments.interfaces";
import {
  IAssessmentQuestionPivot,
  IQuestionAnswerOption,
} from "../features/admin/interfaces/questions.interfaces";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./ImageWithFallback";
import { useAuthStore } from "../features/auth/auth.store";
import { Roles } from "../constants/roles";

// Esquema de validación con Zod
const schema = z.object({
  answers: z.array(z.string().optional()),
});

// Función para hacer shuffle de un array
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

interface SelfAssessmentPageProps {
  assessmentId: string;
}

export const SelfAssessment = ({ assessmentId }: SelfAssessmentPageProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    data: assessment,
    isLoading,
    error,
  } = useAssessmentWithQuestions(assessmentId);

  // Estado para las preguntas con respuestas mezcladas
  const [questionsWithShuffledAnswers, setQuestionsWithShuffledAnswers] =
    useState<IAssessmentQuestionPivot[]>([]);

  // Estado para los resultados de la evaluación
  const [evaluationResult, setEvaluationResult] =
    useState<AssessmentEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Las preguntas ya vienen ordenadas desde el backend, solo necesitamos mezclar las respuestas
  useEffect(() => {
    if (assessment?.questionPivots) {
      const questionsWithShuffled = assessment.questionPivots.map(
        (questionPivot) => ({
          ...questionPivot,
          question: {
            ...questionPivot.question,
            answerOptions: shuffleArray(questionPivot.question.answerOptions),
          },
        })
      );
      setQuestionsWithShuffledAnswers(questionsWithShuffled);
    }
  }, [assessment]);

  const totalQuestions = questionsWithShuffledAnswers.length;
  const [indexQuestion, setIndexQuestion] = useState(0);

  const { setValue, watch, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { answers: Array(totalQuestions).fill("") },
  });

  const answers = watch("answers");

  const handleFinish = async () => {
    const { answers } = getValues();

    setIsEvaluating(true);

    try {
      // Crear un objeto con las respuestas del usuario
      const userAnswers = answers
        .map((answerId, index) => {
          if (!answerId) return null;

          const questionPivot = questionsWithShuffledAnswers[index];
          const selectedOption = questionPivot.question.answerOptions.find(
            (option) => option.id === answerId
          );

          return {
            questionId: questionPivot.question.id,
            answerId: answerId,
            score: selectedOption?.score || 0,
          };
        })
        .filter(
          (
            answer
          ): answer is {
            questionId: string;
            answerId: string;
            score: number;
          } => answer !== null
        );

      // Evaluar el assessment usando el backend
      const evaluationResult = await AssessmentService.evaluate({
        assessmentId,
        answers: userAnswers,
      });

      console.log("Assessment evaluation result:", evaluationResult);

      // Guardar los resultados en el estado para mostrarlos
      setEvaluationResult(evaluationResult);
    } catch (error) {
      console.error("Error evaluating assessment:", error);
      alert("There was an error evaluating your assessment. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Manejo de respuestas - ahora guarda el ID de la opción seleccionada
  const handleAnswer = (answerId: string) => {
    const currentAnswer = answers[indexQuestion];
    setValue(
      `answers.${indexQuestion}`,
      currentAnswer === answerId ? "" : answerId
    );
  };

  // Navegación entre preguntas
  const handleNavigation = (direction: "next" | "back") => {
    setIndexQuestion((prev) =>
      direction === "next" ? prev + 1 : Math.max(0, prev - 1)
    );
  };

  const progressPercentage = Math.round(
    (answers.filter((a) => a !== "").length / totalQuestions) * 100
  );

  const currentQuestion = questionsWithShuffledAnswers[indexQuestion];

  // Si está cargando o no hay datos, mostrar estado de carga
  if (isLoading) {
    return (
      <div className="page-base flex justify-center items-center">
        <p>Loading assessment...</p>
      </div>
    );
  }

  // Si está evaluando, mostrar estado de evaluación
  if (isEvaluating) {
    return (
      <div className="page-base flex justify-center items-center">
        <p>Evaluating your assessment...</p>
      </div>
    );
  }

  // Si hay resultados, mostrar pantalla de resultados
  if (evaluationResult && assessment) {
    return (
      <div className="flex flex-col gap-5">
        {/* Tarjeta de resultados */}
        <div className="p-6 bg-white rounded-2xl">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-main-100 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-main-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Assessment Completed!
            </h2>
            <p className="text-gray-600">{assessment.title}</p>
          </div>

          {/* Score display */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-main-400">
                {evaluationResult.totalScore}/
                {evaluationResult.maxPossibleScore}
              </div>
            </div>
          </div>

          {/* Risk segment information */}
          {evaluationResult.riskSegment && (
            <div className="bg-main-100 rounded-lg p-6 mb-6">
              {evaluationResult.riskSegment.recommendations && (
                <div>
                  <h4 className="font-medium text-main-400 mb-2">
                    Recommendations:
                  </h4>
                  <p className="text-main-400">
                    {evaluationResult.riskSegment.recommendations}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              className="btn btn-outline flex items-center gap-2"
              onClick={() => {
                setEvaluationResult(null);
                setIndexQuestion(0);
                setValue("answers", Array(totalQuestions).fill(""));
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </button>
            <button
              className="btn btn-main"
              onClick={() => navigate("/admin/self-assessments")}
            >
              Back to Assessments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error o no hay assessment, mostrar error
  if (error || !assessment || totalQuestions === 0) {
    // Determine redirect path based on user role
    const redirectPath = user?.roles.includes(Roles.ADMIN) 
      ? "/admin/self-assessments" 
      : "/students/self-assessments";

    return (
      <div className="page-base flex flex-col justify-center items-center gap-5">
        <p>Assessment not found or has no questions.</p>
        <button
          className="btn btn-main"
          onClick={() => navigate(redirectPath)}
        >
          Go back to assessments
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <InstructionsCard assessment={assessment} />
      <div className="p-5 bg-white rounded-2xl">
        <Header
          index={indexQuestion}
          total={totalQuestions}
          assessment={assessment}
        />
        <ProgressBar progress={progressPercentage} />

        {/* Pregunta y opciones */}
        <QuestionCard
          questionPivot={currentQuestion}
          selectedAnswerId={answers[indexQuestion]}
          onAnswer={handleAnswer}
        />

        {/* Botones de navegación */}
        <div className="w-full flex justify-between items-center pt-5 border-t border-[#F2F3F8]">
          <div>
            {indexQuestion > 0 && (
              <ButtonText
                text="Previous question"
                disabled={indexQuestion === 0}
                onClick={() => handleNavigation("back")}
                icon={<ChevronsLeft />}
                iconSide="left"
              />
            )}
          </div>
          <div>
            {progressPercentage === 100 &&
            indexQuestion === totalQuestions - 1 ? (
              <button className="btn btn-main" onClick={handleFinish}>
                <Check className="w-[20px] h-[20px] mr-3" />
                Finish
              </button>
            ) : (
              <>
                {indexQuestion < totalQuestions - 1 && (
                  <ButtonText
                    text="Next question"
                    disabled={indexQuestion === totalQuestions - 1}
                    onClick={() => handleNavigation("next")}
                    icon={<ChevronsRight />}
                    iconSide="right"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const Header = ({
  index,
  total,
  assessment,
}: {
  index: number;
  total: number;
  assessment: IAssessmentWithQuestions;
}) => (
  <div className="mb-5">
    <p className="text-xl font-medium text-main-400 mb-1">{assessment.title}</p>
    <hr className="my-3" />
    <p className="text-dark font-semibold">
      Question {index + 1}/{total}
    </p>
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full h-[8px] flex justify-between items-center bg-gray-400 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-[#21B239]"
        style={{
          width: `${progress}%`,
          transition: "width 0.5s ease-in-out",
        }}
      ></div>
    </div>
  );
};

const QuestionCard = ({
  questionPivot,
  selectedAnswerId,
  onAnswer,
}: {
  questionPivot: IAssessmentQuestionPivot;
  selectedAnswerId: string;
  onAnswer: (answerId: string) => void;
}) => (
  <div
    className={`my-5 gap-4 ${
      questionPivot.question.questionImage
        ? "grid grid-cols-1 md:grid-cols-3"
        : ""
    }`}
  >
    {questionPivot.question.questionImage && (
      <ImageWithFallback
        src={questionPivot.question.questionImage}
        alt="Question"
        className="w-full rounded-[8px] object-cover md:col-span-1"
      />
    )}
    <div className={`flex flex-col gap-4 max-w-4xl mx-auto ${
      questionPivot.question.questionImage ? "md:col-span-2" : ""
    }`}>
      <p className="text-lg text-center text-dark font-bold py-4">
        {questionPivot.question.questionText}
      </p>
      <div className="w-full flex flex-col gap-4">
        {questionPivot.question.answerOptions.map(
          (option: IQuestionAnswerOption) => (
            <AnswerButton
              key={option.id}
              text={option.answerText}
              value={option.id}
              selected={selectedAnswerId}
              onClick={onAnswer}
              score={option.score}
            />
          )
        )}
      </div>
    </div>
  </div>
);

const AnswerButton = ({
  text,
  value,
  selected,
  onClick,
}: {
  text: string;
  value: string;
  selected: string;
  onClick: (value: string) => void;
  score: number;
}) => (
  <button
    className={`w-full rounded-lg py-3 px-4 hover:shadow transition-all ${
      selected === value
        ? "bg-main-300 text-main-100 shadow-lg"
        : "bg-main-100 text-main-400"
    }`}
    onClick={() => onClick(value)}
  >
    <p className="text- font-medium text-left">{text}</p>
  </button>
);

const InstructionsCard = ({
  assessment,
}: {
  assessment: IAssessmentWithQuestions;
}) => {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div
      className={`w-full bg-main-100 rounded-2xl p-4 flex flex-col gap-3 items-start justify-between lg:flex-row lg:items-center lg:justify-between lg:space-x-3 ${
        showInstructions ? "" : " hidden"
      }`}
    >
      {/* Contenido principal */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-main-400">
          {assessment.title}
        </h2>
        <p className="text-sm text-dark">
          {assessment.description ||
            "Complete this assessment by answering all questions."}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          className="btn btn-main bg-main-400"
          onClick={() => setShowInstructions(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};
