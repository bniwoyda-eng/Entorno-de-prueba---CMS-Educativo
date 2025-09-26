import csmApi from '../../../api/csm.api';
import { IAssessmentQuestionPivot } from '../interfaces/questions.interfaces';
import { AttachQuestionToAssessmentDto } from '../schemas/questions.schemas';

export class AssessmentQuestionPivotsService {

    static async attach(dto: AttachQuestionToAssessmentDto) {
        const { data } = await csmApi.post<IAssessmentQuestionPivot>('/assessment-question-pivots', dto);
        return data;
    }

    static async detach(id: string) {
        await csmApi.delete(`/assessment-question-pivots/${id}`);
    }

    static async list(assessmentId: string) {
        const { data } = await csmApi.get<IAssessmentQuestionPivot[]>(`/assessment-question-pivots/${assessmentId}`);
        return data;
    }

    static async reorder(assessmentId: string, dto: AttachQuestionToAssessmentDto[]) {
        const { data } = await csmApi.put<IAssessmentQuestionPivot[]>(`/assessment-question-pivots/${assessmentId}/reorder`, dto);
        return data;
    }
}
