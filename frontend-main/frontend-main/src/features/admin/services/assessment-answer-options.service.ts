import csmApi from '../../../api/csm.api';
import { IPaginationParams, IPaginationResponse } from '../../../common/interfaces';
import { CreateQuestionOptionDto, UpdateQuestionOptionDto } from '../schemas/questions.schemas';
import { IQuestionAnswerOption } from '../interfaces/questions.interfaces';

export class AssessmentAnswerOptionsService {
    static async list() {
        const { data } = await csmApi.get<IQuestionAnswerOption[]>('/assessment-answer-option');
        return data;
    }

    static async listPaginated(params: IPaginationParams) {
        const { data } = await csmApi.get<IPaginationResponse<IQuestionAnswerOption>>('/assessment-answer-option', { params });
        return data;
    }

    static async getByQuestionId(id: string) {
        const { data } = await csmApi.get<IQuestionAnswerOption[]>(`/assessment-answer-option/question/${id}`);
        return data;
    }

    static async get(id: string) {
        const { data } = await csmApi.get<IQuestionAnswerOption>(`/assessment-answer-option/${id}`);
        return data;
    }

    static async create(id_question: string, option: CreateQuestionOptionDto) {
        const { data } = await csmApi.post<IQuestionAnswerOption>(`/assessment-answer-option/${id_question}`, option);
        return data;
    }

    static async update(id: string, option: UpdateQuestionOptionDto) {
        const { data } = await csmApi.put<IQuestionAnswerOption>(`/assessment-answer-option/${id}`, option);
        return data;
    }

    static async remove(id: string) {
        await csmApi.delete(`/assessment-answer-option/${id}`);
    }
}
