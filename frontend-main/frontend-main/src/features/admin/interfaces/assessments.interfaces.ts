import { TAssessmentGradient } from "../enums";
import { IAssessmentQuestionPivot } from "./questions.interfaces";

export interface IAssessment {
    id: string;
    creation_date: string;
    update_date: string;
    delete_date: string | null;
    title: string;
    description: string;
    banner: string;
    maxScore: number;
    gradient: TAssessmentGradient;
    isActive: boolean;
    attempts: number;
    assessmentCategory: IAssessmentCategory;
    riskSegments: IAssessmentRiskSegment[];
}

export interface IAssessmentWithQuestions extends IAssessment {
    questionPivots: IAssessmentQuestionPivot[];
}

export interface IAssessmentCategory {
    id: string;
    name: string;
}

export interface IAssessmentRiskSegment {
    id: string;
    minScore: number;
    maxScore: number;
    recommendations: string;
}

export interface IAssessmentQuestion {
    id: string;
    questionText: string;
    questionImage: string | null;
    answerOptions: IAssessmentAnswerOption[];
}

export interface IAssessmentAnswerOption {
    id: string;
    answerText: string;
    score: number;
}

