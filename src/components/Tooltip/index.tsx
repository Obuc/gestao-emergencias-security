import * as TooltipRadix from '@radix-ui/react-tooltip';

interface ITooltipProps {
  children: React.ReactElement;
  label: string;
}

const Tooltip = ({ children, label }: ITooltipProps) => {
  return (
    <TooltipRadix.Provider delayDuration={300}>
      <TooltipRadix.Root>
        <TooltipRadix.Trigger asChild>{children}</TooltipRadix.Trigger>
        <TooltipRadix.Portal>
          <TooltipRadix.Content
            className="p-2 bg-primary text-white text-xs font-medium rounded-sm shadow"
            data-side="right"
            side="right"
            sideOffset={5}
          >
            {label}
            <TooltipRadix.Arrow className="fill-primary" />
          </TooltipRadix.Content>
        </TooltipRadix.Portal>
      </TooltipRadix.Root>
    </TooltipRadix.Provider>
  );
};

export default Tooltip;
