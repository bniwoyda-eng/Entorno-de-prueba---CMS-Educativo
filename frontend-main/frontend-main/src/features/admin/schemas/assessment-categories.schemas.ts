import { z } from 'zod';

export const CreateAssessmentCategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export type CreateAssessmentCategoryDto = z.infer<typeof CreateAssessmentCategorySchema>;
export const UpdateAssessmentCategorySchema = CreateAssessmentCategorySchema.partial();
export type UpdateAssessmentCategoryDto = z.infer<typeof UpdateAssessmentCategorySchema>;