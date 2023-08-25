interface IEquipmentCardContentProps {
  responsible: string;
  date: string;
  action?: string;
}

export const EquipmentCardContent = ({ responsible, date, action }: IEquipmentCardContentProps) => {
  return (
    <div className="flex gap-4 flex-col mt-4">
      <div className="flex w-full justify-between">
        <span>
          <strong className="text-[#282828]">Responsável:</strong> {responsible}
        </span>
        <span>
          <strong className="text-[#282828]">Data:</strong> {date}
        </span>
      </div>
      {action && <span className="flex w-full ">{action}</span>}
    </div>
  );
};
