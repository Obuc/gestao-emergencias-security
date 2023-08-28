import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as CheckboxRadix from '@radix-ui/react-checkbox';

interface ICheckboxProps extends CheckboxRadix.CheckboxProps {}

const Checkbox = ({ ...props }: ICheckboxProps) => (
  <CheckboxRadix.Root
    {...props}
    className="flex h-[1.25rem] w-[1.25rem] appearance-none items-center justify-center rounded-sm border-[.0625rem] text-sm text-[#676767] border-[#676767] bg-white outline-none focus:shadow-xs-app"
    defaultChecked
    id="c1"
  >
    <CheckboxRadix.Indicator className="text-violet11">
      <FontAwesomeIcon icon={faCheck} />
    </CheckboxRadix.Indicator>
  </CheckboxRadix.Root>
);

export default Checkbox;
