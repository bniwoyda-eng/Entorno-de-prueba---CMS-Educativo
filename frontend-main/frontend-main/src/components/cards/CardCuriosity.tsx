interface CardCuriosityProps {
  curiosity: string;
}

export const CardCuriosity = ({ curiosity }: CardCuriosityProps) => {
  return (
    <div className="w-[222px] h-[200px] rounded-[20px] bg-main-100 flex flex-col items-center">
      <div className="w-[69px] h-[69px] p-[12px] rounded-full bg-main-400 text-white relative top-[-18%] border-white border-[7px]">
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.953 17.155c-4.167 0-8.82 3.389-8.82 7.553m8.82-11.326a5.047 5.047 0 0 0 4.467-7.417 5.041 5.041 0 0 0-5.677-2.52A5.05 5.05 0 0 0 8.918 8.34a5.042 5.042 0 0 0 5.035 5.043Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.842 18.539a1.852 1.852 0 0 1 2.016-1.05 1.793 1.793 0 0 1 1.316.938 1.56 1.56 0 0 1-.907 2.142 1.146 1.146 0 0 0-.741 1.04v.428"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />
          <path
            d="M19.492 24.404h.002"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="w-[193px] min-h-[103px]">
        <h4 className="text-2xl font-semibold text-main-400 leading-[24px] mb-2">
          Do you <br /> know that?
        </h4>
        <p className="text-sm text-main-400 leading-[18px]">{curiosity}</p>
      </div>
    </div>
  );
};
