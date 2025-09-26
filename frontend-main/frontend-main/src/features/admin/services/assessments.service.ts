import csmApi from '../../../api/csm.api';
import { IPaginationParams, IPaginationResponse } from '../../../common/interfaces';
import { IAssessment, IAssessmentWithQuestions } from '../interfaces/assessments.interfaces';
import { CreateAssessmentDto, UpdateAssessmentDto } from '../schemas/assessments.schemas';

export interface AssessmentFilters {
    search?: string;
    isActive?: boolean;
    categoryId?: string;
    sortBy?: 'title' | 'created_at';
    sortOrder?: 'ASC' | 'DESC';
}

export interface AssessmentAnswer {
    questionId: string;
    answerId: string;
    score: number;
}

export interface AssessmentEvaluationRequest {
    assessmentId: string;
    answers: AssessmentAnswer[];
    totalScore?: number;
    maxPossibleScore?: number;
}

export interface AssessmentEvaluationResult {
    assessmentId: string;
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    riskSegment?: {
        id: string;
        minScore: number;
        maxScore: number;
        recommendations?: string;
    };
    answers: AssessmentAnswer[];
}

export class AssessmentService {
    static async list(filters?: AssessmentFilters) {
        const { data } = await csmApi.get<IAssessment[]>('/assessments', { params: filters });
        return data;
    }

    static async listPaginated(params: IPaginationParams) {
        const { data } = await csmApi.get<IPaginationResponse<IAssessment>>('/assessments', { params });
        return data;
    }

    static async getTopByAttempts(order: 'ASC' | 'DESC' = 'DESC', limit: number = 10) {
        const { data } = await csmApi.get<IAssessment[]>('/assessments/top-by-attempts', { 
            params: { order, limit } 
        });
        return data;
    }

    static async get(id: string) {
        const { data } = await csmApi.get<IAssessment>(`/assessments/${id}`);
        return data;
    }

    static async getWithQuestions(id: string) {
        const { data } = await csmApi.get<IAssessmentWithQuestions>(`/assessments/${id}/questions`);
        return data;
    }

    static async create(assessment: CreateAssessmentDto) {
        const { data } = await csmApi.post<IAssessment>('/assessments', assessment);
        return data;
    }

    static async update(id: string, assessment: UpdateAssessmentDto) {
        const { data } = await csmApi.put<IAssessment>(`/assessments/${id}`, assessment);
        return data;
    }

    static async remove(id: string) {
        await csmApi.delete(`/assessments/${id}`);
    }

    static async evaluate(evaluation: AssessmentEvaluationRequest) {
        const { data } = await csmApi.post<AssessmentEvaluationResult>('/assessments/evaluate', evaluation);
        return data;
    }
}
