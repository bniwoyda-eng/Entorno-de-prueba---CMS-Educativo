import {
  SectionGames,
  SectionEvents,
  SectionProgress,
  SectionSelfAssessment,
} from "../sections";

export const Home = () => {
  return (
    <div className="page-base">
      <img
        // src="https://placehold.co/1600x200"
        src="/banner-student.png"
        alt="Banner"
        className="w-full rounded-lg object-cover hidden xl:block mb-5 shadow max-h-[200px]"
      />

      <div className="grid xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <SectionProgress />
          <SectionGames />
        </div>

        <div className="xl:col-span-1 flex flex-col gap-4 box-border">
          <SectionSelfAssessment />
          <SectionEvents />
        </div>
      </div>
    </div>
  );
};
