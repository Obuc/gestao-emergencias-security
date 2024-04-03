import { forwardRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IPopoverContentProps {
  children: React.ReactNode;
}

const PopoverContent = forwardRef<HTMLDivElement, IPopoverContentProps>(({ children, ...props }, forwardedRef) => {
  return (
    <Popover.Portal>
      <Popover.Content
        {...props}
        ref={forwardedRef}
        sideOffset={5}
        align="end"
        className="rounded p-5 min-[1100px]:max-h-[37.5rem] min-[1500px]:max-h-[40.625rem] min-[1800px]:max-h-[46.875rem] overflow-y-scroll w-[26.5625rem] bg-white border border-[#B3B3B3] shadow-xs-app will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
      >
        {children}

        <Popover.Close
          className="h-[2.5rem] w-[2.5rem] bg-[#EDEDED] text-pink hover:bg-pink hover:text-white duration-300 inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] outline-none"
          aria-label="Fechar"
          title="Fechar"
        >
          <FontAwesomeIcon icon={faXmark} />
        </Popover.Close>
      </Popover.Content>
    </Popover.Portal>
  );
});

export default PopoverContent;
