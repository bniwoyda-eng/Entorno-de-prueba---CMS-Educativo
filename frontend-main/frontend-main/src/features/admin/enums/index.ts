export const AssessmentGradient = {
    red_to_green: "red_to_green",
    green_to_red: "green_to_red",
    not_defined: "not_defined",
} as const;

export const AssessmentGradientLabels: Record<
    keyof typeof AssessmentGradient,
    string
> = {
    red_to_green: "Red to Green",
    green_to_red: "Green to Red",
    not_defined: "Not Defined",
};

export type TAssessmentGradient = typeof AssessmentGradient[keyof typeof AssessmentGradient];