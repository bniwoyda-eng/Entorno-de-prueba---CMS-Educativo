import { z } from 'zod';

export const CreateQuestionSchema = z.object({
    questionText: z.string().min(1, 'Question text is required'),
    questionImage: z.string().optional(),
});

export type CreateQuestionDto = z.infer<typeof CreateQuestionSchema>;
export const UpdateQuestionSchema = CreateQuestionSchema.partial();
export type UpdateQuestionDto = z.infer<typeof UpdateQuestionSchema>;


export const CreateQuestionOptionSchema = z.object({
    answerText: z.string().min(1, 'Answer text is required'),
    score: z.number().min(0, 'Score must be greater than 0'),
});

export type CreateQuestionOptionDto = z.infer<typeof CreateQuestionOptionSchema>;
export const UpdateQuestionOptionSchema = CreateQuestionOptionSchema.partial();
export type UpdateQuestionOptionDto = z.infer<typeof UpdateQuestionOptionSchema>;




export const AttachQuestionToAssessmentSchema = z.object({
    id_assessment: z.string().uuid('Invalid assessment ID'),
    id_assessment_question: z.string().uuid('Invalid question ID'),
    order: z.number().min(0, 'Order must be greater than 0'),
});

export type AttachQuestionToAssessmentDto = z.infer<typeof AttachQuestionToAssessmentSchema>;