interface IEquipmentCardContentProps {
  responsible: string;
  date: string;
  action?: string;
  cod?: string;
}

export const EquipmentCardContent = ({ responsible, date, action, cod }: IEquipmentCardContentProps) => {
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
      {cod && (
        <span>
          <strong className="text-[#282828]">Código Equipamento:</strong> {cod}
        </span>
      )}
    </div>
  );
};
