import { Info } from "lucide-react";

interface Props {
  icon?: React.ReactNode;
  message: string;
}

export const InforAlert = ({
  icon = <Info className="w-6 h-6 mr-2 shrink-0 hidden lg:block " />,
  message,
}: Props) => {
  return (
    <div className="bg-main-100 flex items-center text-main p-5 rounded-xl">
      {icon}
      <p>{message}</p>
    </div>
  );
};
