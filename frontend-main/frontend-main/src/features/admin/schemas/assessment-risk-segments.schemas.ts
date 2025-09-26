import { z } from 'zod';

const BaseAssessmentRiskSegmentSchema = z.object({
    id: z
        .string()
        .uuid('Invalid ID')
        .optional(),
    minScore: z.number().min(0, 'Min score is required'),
    maxScore: z
        .number()
        .min(0, 'Max score is required')
        .refine((val) => val > 0, {
            message: 'Max score must be greater than 0',
        }),
    recommendations: z.string().min(1, 'Recommendations is required'),
});

export const CreateAssessmentRiskSegmentSchema = BaseAssessmentRiskSegmentSchema
    .refine((data) => data.minScore < data.maxScore, {
        message: 'Min score must be less than max score',
        path: ['minScore'],
    });

export type CreateAssessmentRiskSegmentDto = z.infer<typeof CreateAssessmentRiskSegmentSchema>;

export const UpdateAssessmentRiskSegmentSchema = BaseAssessmentRiskSegmentSchema.partial();
export type UpdateAssessmentRiskSegmentDto = z.infer<typeof UpdateAssessmentRiskSegmentSchema>;

// El esquema usado por el batch
export const RiskSegmentBatchSchema = z.object({
    riskSegments: z.array(CreateAssessmentRiskSegmentSchema).superRefine((segments, ctx) => {
        const sorted = [...segments].sort((a, b) => a.minScore - b.minScore);
        for (let i = 0; i < sorted.length - 1; i++) {
            const current = sorted[i];
            const next = sorted[i + 1];

            if (current.maxScore > next.minScore) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Segment "${current.minScore} - ${current.maxScore}" overlaps with "${next.minScore} - ${next.maxScore}"`,
                    path: [i, 'maxScore'],
                });
            }
        }
    }),
});
