export interface IQuestion {
    id: string;
    questionText: string;
    questionImage: string | null;
    maxScore: number;
    answerOptions: IQuestionAnswerOption[];
}

export interface IQuestionAnswerOption {
    id: string;
    answerText: string;
    score: number;
}

export interface IQuestionAnswers extends IQuestion {
    answerOptions: IQuestionAnswerOption[];
}

export interface IAssessmentQuestionPivot {
    id: string;
    id_assessment: string;
    id_assessment_question: string;
    order: number;
    question: IQuestion;
}
