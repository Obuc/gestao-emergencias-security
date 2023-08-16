interface IAnswersContentItemProps {
  children: React.ReactNode;
}

export const AnswersContentItem = ({ children }: IAnswersContentItemProps) => {
  return <div className="flex flex-1 flex-col">{children}</div>;
};
