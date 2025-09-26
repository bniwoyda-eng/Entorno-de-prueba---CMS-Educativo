import csmApi from '../../../api/csm.api';
import { IAssessmentRiskSegment } from '../interfaces/assessments.interfaces';
import { CreateAssessmentRiskSegmentDto, UpdateAssessmentRiskSegmentDto } from '../schemas/assessment-risk-segments.schemas';

export class AssessmentRiskSegmentService {
    static async list(): Promise<IAssessmentRiskSegment[]> {
        const { data } = await csmApi.get<IAssessmentRiskSegment[]>('/assessment-risk-segments');
        return data;
    }

    static async get(id: string) {
        const { data } = await csmApi.get<IAssessmentRiskSegment>(`/assessment-risk-segments/${id}`);
        return data;
    }

    static async getByAssessmentId(assessmentId: string) {
        const { data } = await csmApi.get<IAssessmentRiskSegment[]>(`/assessment-risk-segments/by-assessment/${assessmentId}`);
        return data;
    }

    static async create(assessmentRiskSegment: CreateAssessmentRiskSegmentDto) {
        const { data } = await csmApi.post<IAssessmentRiskSegment>('/assessment-risk-segments', assessmentRiskSegment);
        return data;
    }

    static async createMany(assessmentId: string, dto: CreateAssessmentRiskSegmentDto[]) {
        const { data } = await csmApi.post<IAssessmentRiskSegment[]>(`/assessment-risk-segments/by-assessment/${assessmentId}`, { riskSegments: dto });
        return data;
    }

    static async update(id: string, assessmentRiskSegment: UpdateAssessmentRiskSegmentDto) {
        const { data } = await csmApi.put<IAssessmentRiskSegment>(`/assessment-risk-segments/${id}`, assessmentRiskSegment);
        return data;
    }

    static async remove(id: string) {
        await csmApi.delete(`/assessment-risk-segments/${id}`);
    }
}
