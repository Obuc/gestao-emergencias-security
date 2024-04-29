import { ComponentProps } from 'react';

interface IAnswersButtonProps extends ComponentProps<'button'> {
  answersValue: boolean;
  disabled?: boolean;
}

export const AnswersButton = ({ answersValue, ...props }: IAnswersButtonProps) => {
  if (answersValue) {
    return (
      <button
        type="button"
        {...props}
        className="p-1.5 mt-1 w-[6.25rem] h-10 bg-[#F1FEEB] flex justify-center items-center font-medium border border-[#86EF54] rounded-sm"
      >
        Sim
      </button>
    );
  }

  if (!answersValue) {
    return (
      <button
        type="button"
        {...props}
        className="p-1.5 mt-1 w-[6.25rem] h-10 bg-[#FFB3C1] flex justify-center items-center font-medium border border-[#FF012F] text-[#FF012F] rounded-sm"
      >
        Não
      </button>
    );
  }
};
