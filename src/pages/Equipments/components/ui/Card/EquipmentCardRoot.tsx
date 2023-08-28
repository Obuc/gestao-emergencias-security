import { VariantProps, tv } from 'tailwind-variants';

interface IEquipmentCardRootProps {
  children: React.ReactNode;
}

const cardRoot = tv({
  slots: {
    base: 'w-full h-[11rem] rounded-lg p-6 flex flex-col text-[#282828]', // bg-[#282828]/5
  },
  variants: {
    variant: {
      noncompliant: {
        base: 'bg-[#ffdee480] border-[.0625rem] border-[#F82B5080]',
      },
      modification: {
        base: 'bg-[#282828]/5',
      },
      new: {
        base: 'bg-[#FFFAE9] border-[.0625rem] border-[#FFE384]',
      },
    },
  },
  defaultVariants: {
    variant: 'noncompliant',
  },
});

export const EquipmentCardRoot = ({ children, variant }: IEquipmentCardRootProps & VariantProps<typeof cardRoot>) => {
  const { base } = cardRoot({ variant });

  return <div className={base()}>{children}</div>;
};
