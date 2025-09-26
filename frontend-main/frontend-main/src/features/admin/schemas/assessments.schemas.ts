import { z } from 'zod';
import { AssessmentGradient } from '../enums';

export const CreateAssessmentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    id_assessment_category: z.string().nonempty('Assessment category is required'),
    isActive: z.boolean().optional().default(false),
    gradient: z.nativeEnum(AssessmentGradient).optional().nullable(),
});

export type CreateAssessmentDto = z.infer<typeof CreateAssessmentSchema>;
export const UpdateAssessmentSchema = CreateAssessmentSchema.partial();
export type UpdateAssessmentDto = z.infer<typeof UpdateAssessmentSchema>;
