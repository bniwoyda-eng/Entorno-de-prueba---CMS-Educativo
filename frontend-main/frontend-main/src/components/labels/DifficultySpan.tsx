import { TCourseLevel } from "../../features/common/courses/courses.types";

const Difficulties: Record<TCourseLevel, { text: string; level: 1 | 2 | 3 }> = {
  BASIC: { text: "Basic", level: 1 },
  INTERMEDIATE: { text: "Intermediate", level: 2 },
  ADVANCED: { text: "Advanced", level: 3 },
};

interface Props {
  difficulty: TCourseLevel;
}

export const DifficultySpan = ({ difficulty }: Props) => {
  const { text, level } = Difficulties[difficulty];
  return (
    <span className="w-fit bg-main-100 text-main-400 px-3 py-1 shadow rounded-lg text-sm gap-2 inline-flex">
      <LogoLevel level={level} />
      {text}
    </span>
  );
};

const LogoLevel: React.FC<{ level: number }> = ({ level }) => {
  return (
    <svg
      width="16"
      height="19"
      viewBox="0 0 16 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base del icono con una pequeña separación */}
      <rect x="0" y="17" width="16" height="1.5" fill="currentColor" />

      {/* Primer palo (subido 1px) */}
      <path
        d="M0 8.21029C0 7.34604 0 6.91392 0.292893 6.64544C0.585786 6.37695 1.05719 6.37695 2 6.37695C2.94281 6.37695 3.41421 6.37695 3.70711 6.64544C4 6.91392 4 7.34604 4 8.21029V13.7103C4 14.5745 4 15.0066 3.70711 15.2751C3.41421 15.5436 2.94281 15.5436 2 15.5436C1.05719 15.5436 0.585786 15.5436 0.292893 15.2751C0 15.0066 0 14.5745 0 13.7103V8.21029Z"
        fill="currentColor"
        fillOpacity={level >= 1 ? "1" : "0.3"}
      />

      {/* Segundo palo (subido 1px) */}
      <path
        d="M6 4.54329C6 3.67905 6 3.24693 6.29289 2.97845C6.58579 2.70996 7.05719 2.70996 8 2.70996C8.94281 2.70996 9.41421 2.70996 9.70711 2.97845C10 3.24693 10 3.67905 10 4.54329V13.71C10 14.5742 10 15.0063 9.70711 15.2748C9.41421 15.5433 8.94281 15.5433 8 15.5433C7.05719 15.5433 6.58579 15.5433 6.29289 15.2748C6 15.0063 6 14.5742 6 13.71V4.54329Z"
        fill="currentColor"
        fillOpacity={level >= 2 ? "1" : "0.3"}
      />

      {/* Tercer palo (subido 1px) */}
      <path
        d="M12 1.79329C12 0.929047 12 0.496928 12.2929 0.228445C12.5858 -0.0400372 13.0572 -0.0400372 14 -0.0400372C14.9428 -0.0400372 15.4142 -0.0400372 15.7071 0.228445C16 0.496928 16 0.929047 16 1.79329V13.71C16 14.5742 16 15.0063 15.7071 15.2748C15.4142 15.5433 14.9428 15.5433 14 15.5433C13.0572 15.5433 12.5858 15.5433 12.2929 15.2748C12 15.0063 12 14.5742 12 13.71V1.79329Z"
        fill="currentColor"
        fillOpacity={level >= 3 ? "1" : "0.3"}
      />
    </svg>
  );
};
