import csmApi from '../../../api/csm.api';
import { IPaginationParams, IPaginationResponse } from '../../../common/interfaces';
import { CreateQuestionDto, UpdateQuestionDto } from '../schemas/questions.schemas';
import { IQuestionAnswers } from '../interfaces/questions.interfaces';

export class AssessmentQuestionsService {
    static async list() {
        const { data } = await csmApi.get<IQuestionAnswers[]>('/assessment-questions');
        return data;
    }

    static async listPaginated(params: IPaginationParams) {
        const { data } = await csmApi.get<IPaginationResponse<IQuestionAnswers>>('/assessment-questions', { params });
        return data;
    }

    static async get(id: string) {
        const { data } = await csmApi.get<IQuestionAnswers>(`/assessment-questions/${id}`);
        return data;
    }

    static async create(question: CreateQuestionDto) {
        const { data } = await csmApi.post<IQuestionAnswers>('/assessment-questions', question);
        return data;
    }

    static async update(id: string, question: UpdateQuestionDto) {
        const { data } = await csmApi.put<IQuestionAnswers>(`/assessment-questions/${id}`, question);
        return data;
    }

    static async remove(id: string) {
        await csmApi.delete(`/assessment-questions/${id}`);
    }

    static async findAvailableQuestions(assessmentId: string, search?: string) {
        const params = search ? { search } : {};
        const { data } = await csmApi.get<IQuestionAnswers[]>(`/assessment-questions/${assessmentId}/available-questions`, { params });
        return data;
    }

    static async getQuestionImage(id: string) {
        const { data } = await csmApi.get<string>(`/assessment-questions/${id}/image`);
        return data;
    }

    static async uploadQuestionImage(id: string, file: File) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await csmApi.post<string>(`/assessment-questions/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    }

    static async removeQuestionImage(id: string) {
        await csmApi.delete(`/assessment-questions/${id}/image`);
    }   
}
