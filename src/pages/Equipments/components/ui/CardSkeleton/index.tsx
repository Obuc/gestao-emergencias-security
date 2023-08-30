import { Skeleton } from '@mui/material';

const CardSkeleton = () => {
  return (
    <div className="w-full h-[11rem] rounded-lg p-6 flex flex-col mb-2 bg-[#282828]/5">
      <div className="flex w-full h-10 justify-between pb-4 border-b-[.0625rem] border-b-[#ADADAD] ">
        <span className="text-xl h-10 font-semibold">
          <Skeleton className="w-[15rem]" />
        </span>
        <div className="uppercase flex gap-2 justify-center items-center cursor-default border-b border-b-transparent hover:border-b hover:border-b-black duration-200">
          <Skeleton className="w-[15rem]" />
        </div>
      </div>

      <div className="flex gap-4 flex-col mt-4">
        <div className="flex w-full justify-between">
          <span>
            <Skeleton className="w-[17.8125rem]" />
          </span>
          <span>
            <Skeleton className="w-[9.375rem]" />
          </span>
        </div>
        <span>
          <Skeleton className="w-[12rem]" />
        </span>
      </div>
    </div>
  );
};

export default CardSkeleton;
