interface IEquipmentCardRootProps {
  children: React.ReactNode;
}
export const EquipmentCardRoot = ({ children }: IEquipmentCardRootProps) => {
  return <div className="w-full h-[11rem] rounded-lg p-6 flex flex-col bg-[#282828]/5 text-[#282828]">{children}</div>;
};
