export const AssessmentGradient = {
    RED_TO_GREEN: 'red_to_green',
    GREEN_TO_RED: 'green_to_red',
    NOT_DEFINED: 'not_defined',
} as const;

export type TAssessmentGradient = typeof AssessmentGradient[keyof typeof AssessmentGradient];