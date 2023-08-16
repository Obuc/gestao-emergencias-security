import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IButtonIconProps {
  icon: IconDefinition;
}

export const ButtonIcon = ({ icon }: IButtonIconProps) => {
  return <FontAwesomeIcon icon={icon} />;
};
