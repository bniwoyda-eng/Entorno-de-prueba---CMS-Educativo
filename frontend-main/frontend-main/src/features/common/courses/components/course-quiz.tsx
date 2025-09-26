import { useEffect, useMemo, useState } from "react";
import { Button, ButtonText } from "../../../../components";
import { Check, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  useCheckQuiz,
  useGetQuiz,
  useMaterialProgress,
} from "../courses.queries";
import {
  IQuestionAnswer,
  IMaterialProgress,
  TQuizMaterial,
} from "../courses.types";

interface Props {
  materialId: string;
  handleNavigateNext: () => void;
  updateMaterialCompletion: (materialId: string, completed: boolean) => void;
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export const CourseQuiz = ({
  materialId,
  handleNavigateNext,
  updateMaterialCompletion,
}: Props) => {
  const { data: quiz } = useGetQuiz(materialId);
  const { mutate: checkQuiz, isPending } = useCheckQuiz(materialId);
  const { data, isLoading, isError } = useMaterialProgress(materialId);

  const [current, setCurrent] = useState(0);
  const totalQuestions = quiz?.questions.length || 0;
  const [answers, setAnswers] = useState<IQuestionAnswer[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<
    TQuizMaterial["questions"]
  >([]);
  const [materialProgress, setMaterialProgress] =
    useState<IMaterialProgress | null>(null);

  useEffect(() => {
    if (data) setMaterialProgress(data);
  }, [data]);

  useEffect(() => {
    if (quiz) {
      const randomizedQuestions = quiz.questions.map((q) => ({
        ...q,
        answerOptions: shuffleArray(q.answerOptions),
      }));
      setShuffledQuestions(randomizedQuestions);
    }
  }, [quiz]);

  const question = shuffledQuestions[current];

  const handleOptionChange = (optionId: string) => {
    const existing = answers.find((a) => a.questionId === question.id);

    if (question.type === "single") {
      const newAnswers = existing
        ? answers.map((a) =>
            a.questionId === question.id
              ? { ...a, selectedOptionsIds: [optionId] }
              : a
          )
        : [
            ...answers,
            { questionId: question.id, selectedOptionsIds: [optionId] },
          ];
      setAnswers(newAnswers);
    } else {
      const selectedSet = new Set(existing?.selectedOptionsIds || []);
      selectedSet.has(optionId)
        ? selectedSet.delete(optionId)
        : selectedSet.add(optionId);
      const newAnswers = existing
        ? answers.map((a) =>
            a.questionId === question.id
              ? { ...a, selectedOptionsIds: Array.from(selectedSet) }
              : a
          )
        : [
            ...answers,
            { questionId: question.id, selectedOptionsIds: [optionId] },
          ];
      setAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (current < totalQuestions - 1) {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const selectedAnswer =
    answers.find((a) => a.questionId === question.id)?.selectedOptionsIds || [];

  const progressPercentage = useMemo(() => {
    return Math.round(
      (answers.filter((a) => a.selectedOptionsIds.length > 0).length /
        totalQuestions) *
        100
    );
  }, [answers, totalQuestions]);

  if (
    !quiz ||
    isLoading ||
    !materialProgress ||
    shuffledQuestions.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loader"></div>
      </div>
    );
  }

  const handleSubmit = () => {
    // Validar que todas las preguntas tengan respuesta
    const allAnswered = quiz.questions.every((q) =>
      answers.some(
        (a) => a.questionId === q.id && a.selectedOptionsIds.length > 0
      )
    );

    if (!allAnswered) {
      alert("Por favor responde todas las preguntas antes de enviar.");
      return;
    }

    // Enviar respuestas al servidor
    checkQuiz(
      { quizId: quiz.id, answers },
      {
        onSuccess: (data) => {
          if (data.progressPercentage === 100) {
            updateMaterialCompletion(materialId, true);
            setMaterialProgress({
              ...materialProgress,
              progressPercentage: data.progressPercentage,
              score: data.score,
            });
          }
        },
      }
    );
  };

  const handleTryAgain = () => {
    setCurrent(0);
    setAnswers([]);
    setMaterialProgress({
      ...materialProgress,
      progressPercentage: 0,
      score: 0,
    });
    setShuffledQuestions(
      quiz.questions.map((q) => ({
        ...q,
        answerOptions: shuffleArray(q.answerOptions),
      }))
    );
  };

  if (isLoading || !materialProgress || shuffledQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Something went wrong while loading the quiz. Please try again later.
      </div>
    );
  }

  return (
    <>
      {materialProgress.progressPercentage === 0 ? (
        <div className="flex flex-col h-full">
          {isPending ? (
            <div className="flex items-center justify-center h-96">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <div className="flex-1 p-5">
                <h1 className="text-xl font-medium">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.description}</p>
                <p className="my-4 font-bold">
                  Question {current + 1} / {totalQuestions}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#21B239] h-2 rounded-full"
                    style={{
                      width: `${progressPercentage}%`,
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>

                <p className="my-4 text-gray-600">{question.text}</p>

                <div className="my-4 flex flex-col gap-3">
                  {question.answerOptions.map((opt) => (
                    <label
                      key={opt.id}
                      htmlFor={opt.id}
                      className="d-block border p-3 rounded-xl bg-gray-100 text-gray-600"
                    >
                      <input
                        id={opt.id}
                        type={question.type === "single" ? "radio" : "checkbox"}
                        name={question.id}
                        value={opt.id}
                        checked={selectedAnswer.includes(opt.id)}
                        onChange={() => handleOptionChange(opt.id)}
                        className="accent-main-400"
                      />
                      <span className="ms-3">{opt.option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex-between px-2 py-5 bg-white border-t">
                <div>
                  {current > 0 && (
                    <ButtonText
                      text="Previous"
                      disabled={current === 0}
                      onClick={handleBack}
                      icon={<ChevronsLeft />}
                      iconSide="left"
                    />
                  )}
                </div>
                <div>
                  {progressPercentage === 100 &&
                    current === totalQuestions - 1 && (
                      <Button
                        text="Finish"
                        onClick={handleSubmit}
                        disabled={progressPercentage < 100 || isPending}
                        iconSide="left"
                        icon="check"
                      />
                    )}
                  {current < totalQuestions - 1 && (
                    <ButtonText
                      text="Next"
                      disabled={current === totalQuestions - 1}
                      onClick={handleNext}
                      icon={<ChevronsRight />}
                      iconSide="right"
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-96 items-center justify-center p-5">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-main-100 mb-4">
            <Check className="text-main-400" size={80} />
          </div>
          <p className="font-medium">
            You have already completed this quiz! Great job!
          </p>
          <p className="text-gray-600">
            Your score is {Math.round(materialProgress.score * 100) / 100} out
            of 100 points.
          </p>
          <div className="flex-center gap-3">
            <Button
              transparent
              text="Try again"
              onClick={handleTryAgain}
              className="mt-4 text-sm"
            />
            <Button
              text="Next lesson"
              onClick={handleNavigateNext}
              className="mt-4 text-sm"
            />
          </div>
        </div>
      )}
    </>
  );
};
