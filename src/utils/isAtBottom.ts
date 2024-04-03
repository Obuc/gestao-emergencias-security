const isAtBottom = ({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean => {
  return currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight;
};

export default isAtBottom;
