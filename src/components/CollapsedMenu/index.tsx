import React, { useState } from 'react';
import { Collapse } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { CollapsedMenuRoot } from './CollapsedMenuRoot';
import { CollapsedMenuItemRoot } from './CollapsedMenuItemRoot';
import { CollapsedMenuItemLabel } from './CollapsedMenuItemLabel';
import { CollapsedMenuItemAction } from './CollapsedMenuItemAction';

export interface SubItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

export interface MenuItem {
  label: string;
  path?: string;
  subitems?: SubItem[];
  icon?: React.ElementType;
}

const CollapsedMenu = ({ items }: { items: Array<MenuItem> }) => {
  const navigate = useNavigate();
  const localtion = useLocation();

  const [openMenus, setOpenMenus] = useState<boolean[]>(
    items.map((item) => {
      if (item.path) {
        return location.pathname === item.path;
      }
      if (item.subitems) {
        return item.subitems.some((subitem) => localtion.pathname === subitem.path);
      }
      return false;
    }),
  );

  const toggleMenu = (index: number) => {
    setOpenMenus((prevMenus) => {
      const newMenus = [...prevMenus];
      newMenus[index] = !newMenus[index];
      return newMenus;
    });
  };

  const handleNavigate = (route: string) => {
    if (route.includes('https')) {
      window.open(route, '_blank');
      return;
    }
    navigate(route);
  };

  return (
    <CollapsedMenuRoot>
      {items.map((item, index) => {
        const isLocationActivePartial =
          item.path?.split('/')[1] && localtion.pathname.split('/')[1].includes(item.path?.split('/')[1]); //localtion.pathname.split('/')[1] === item.path?.split('/')[1];

        const handleCollapsedMenuItemAction = () => {
          if (item.path) return handleNavigate(item.path);
          toggleMenu(index);
        };

        return (
          <React.Fragment key={item.label}>
            <CollapsedMenuItemRoot label={item.label}>
              <CollapsedMenuItemAction
                active={isLocationActivePartial ? 'true' : 'false'}
                onClick={handleCollapsedMenuItemAction}
              >
                <CollapsedMenuItemLabel>{item.label}</CollapsedMenuItemLabel>

                {item.subitems && (
                  <>
                    {!openMenus[index] && <FontAwesomeIcon className="pr-4" icon={faAngleDown} />}
                    {openMenus[index] && <FontAwesomeIcon className="pr-4" icon={faAngleUp} />}
                  </>
                )}
              </CollapsedMenuItemAction>
            </CollapsedMenuItemRoot>

            {item.subitems && (
              <Collapse in={openMenus[index]} timeout="auto" unmountOnExit>
                {item.subitems.map((subitem) => {
                  const collpseLocationActivePartial = localtion.pathname.split('/')[2] === subitem.path.split('/')[2];

                  return (
                    <CollapsedMenuItemRoot isSub key={subitem.path} label={subitem.label}>
                      <CollapsedMenuItemAction
                        active={collpseLocationActivePartial ? 'true' : 'false'}
                        onClick={() => handleNavigate(subitem.path)}
                      >
                        <CollapsedMenuItemLabel>{subitem.label}</CollapsedMenuItemLabel>
                      </CollapsedMenuItemAction>
                    </CollapsedMenuItemRoot>
                  );
                })}
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </CollapsedMenuRoot>
  );
};

export default CollapsedMenu;
