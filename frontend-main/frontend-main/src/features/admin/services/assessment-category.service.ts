import csmApi from '../../../api/csm.api';
import { IAssessmentCategory } from '../interfaces/assessments.interfaces';
import { CreateAssessmentCategoryDto, UpdateAssessmentCategoryDto } from '../schemas/assessment-categories.schemas';

export class AssessmentCategoryService {
    static async list(): Promise<IAssessmentCategory[]> {
        const { data } = await csmApi.get<IAssessmentCategory[]>('/assessment-categories');
        return data;
    }

    static async get(id: string) {
        const { data } = await csmApi.get<IAssessmentCategory>(`/assessment-categories/${id}`);
        return data;
    }

    static async create(assessmentCategory: CreateAssessmentCategoryDto) {
        const { data } = await csmApi.post<IAssessmentCategory>('/assessment-categories', assessmentCategory);
        return data;
    }

    static async update(id: string, assessmentCategory: UpdateAssessmentCategoryDto) {
        const { data } = await csmApi.put<IAssessmentCategory>(`/assessment-categories/${id}`, assessmentCategory);
        return data;
    }

    static async remove(id: string) {
        await csmApi.delete(`/assessment-categories/${id}`);
    }
}
