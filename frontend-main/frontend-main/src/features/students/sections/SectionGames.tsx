import { SliderController } from "../../../components";
import { CardGame } from "../../../components/cards";
import {
  LogoGameHackShield,
  LogoGamePhish,
  LogoGamePuzzle,
  LogoGameSafe,
} from "../../../icons";

interface GameProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor?: string;
}

const data: GameProps[] = [
  {
    to: "#",
    icon: <LogoGamePuzzle />,
    title: "CyberQuest",
    subtitle: "Lorem ipsum dolor sit amet",
    bgColor: "#42BFF533",
  },
  {
    to: "#",
    icon: <LogoGamePhish />,
    title: "PhishBusters",
    subtitle: "Lorem ipsum dolor sit amet",
    bgColor: "#6449F133",
  },
  {
    to: "#",
    icon: <LogoGameSafe />,
    title: "Safe Social",
    subtitle: "Lorem ipsum dolor sit amet",
    bgColor: "#FB605333",
  },
  {
    to: "#",
    icon: <LogoGameHackShield />,
    title: "HackShield",
    subtitle: "Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet",
    bgColor: "#8E9FFE66",
  },
];

export const SectionGames = () => {
  return (
    <div>
      <div className="flex justify-between items-center h-8 mb-4">
        <h2 className="text-xl font-medium">Games</h2>
        <SliderController
          index={0}
          onClickPrev={() => {}}
          onClickNext={() => {}}
          total={0}
        />
      </div>

      <div className="flex flex-wrap gap-[20px] w-full justify-between">
        {data.map((game, index) => (
          <CardGame
            key={index}
            to={game.to}
            title={game.title}
            subtitle={game.subtitle}
            icon={game.icon}
            bgColor={game.bgColor}
          />
        ))}
      </div>
    </div>
  );
};
