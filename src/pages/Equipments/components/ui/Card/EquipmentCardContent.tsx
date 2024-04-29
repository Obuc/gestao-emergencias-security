interface IEquipmentCardContentProps {
  responsible: string;
  date: string;
  action?: string;
  cod?: string;
  newCod?: string;
  newDate?: string;
  observation?: string;
}

export const EquipmentCardContent = ({
  responsible,
  date,
  action,
  cod,
  newCod,
  newDate,
  observation,
}: IEquipmentCardContentProps) => {
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

      {observation && (
        <span>
          <strong className="text-[#282828]">Observações:</strong> {observation}
        </span>
      )}

      {action && (
        <span>
          <strong className="text-[#282828]">Ação:</strong> Verificação de {action}
        </span>
      )}

      {newCod && (
        <span>
          <strong className="text-[#282828]">Novo código:</strong> {newCod}
        </span>
      )}

      {newDate && (
        <span>
          <strong className="text-[#282828]">Nova validade:</strong> {newDate}
        </span>
      )}

      {cod && (
        <span>
          <strong className="text-[#282828]">Código Equipamento:</strong> {cod}
        </span>
      )}
    </div>
  );
};
