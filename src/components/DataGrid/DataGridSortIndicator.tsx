import React from 'react';
import { RenderSortStatusProps } from 'react-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const DataGridSortIndicator: React.FC<RenderSortStatusProps> = ({ sortDirection, priority }) => {
  return (
    <div className="text-primary-font-font text-sm ml-2">
      {sortDirection !== undefined ? (
        sortDirection === 'ASC' ? (
          <FontAwesomeIcon icon={faChevronUp} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} />
        )
      ) : null}
      <span className="pl-1 text-base">{priority}</span>
    </div>
  );
};

export default React.memo(DataGridSortIndicator);
