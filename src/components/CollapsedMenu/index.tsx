import React, { useState } from 'react';
import { Collapse } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { CollapsedMenuRoot } from './CollapsedMenuRoot';
import { CollapsedMenuItemRoot } from './CollapsedMenuItemRoot';
import { CollapsedMenuItemIcon } from './CollapsedMenuItemIcon';
import { CollapsedMenuItemLabel } from './CollapsedMenuItemLabel';
import { CollapsedMenuItemAction } from './CollapsedMenuItemAction';

export interface SubItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export interface MenuItem {
  label: string;
  path?: string;
  subitems?: SubItem[];
  icon: React.ElementType;
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
    navigate(route);
  };

  return (
    <CollapsedMenuRoot>
      {items.map((item, index) => {
        const isLocationActive = localtion.pathname === item.path;

        const handleCollapsedMenuItemAction = () => {
          if (item.path) return handleNavigate(item.path);
          toggleMenu(index);
        };

        return (
          <React.Fragment key={item.label}>
            <CollapsedMenuItemRoot label={item.label}>
              <CollapsedMenuItemAction
                active={isLocationActive ? 'true' : 'false'}
                onClick={handleCollapsedMenuItemAction}
              >
                <CollapsedMenuItemIcon active={isLocationActive} icon={item.icon} />
                <CollapsedMenuItemLabel active={isLocationActive}>{item.label}</CollapsedMenuItemLabel>

                {!openMenus[index] && item?.subitems && item.subitems[index] && (
                  <FontAwesomeIcon className="pr-4" icon={faAngleDown} />
                )}
                {openMenus[index] && item?.subitems && item.subitems[index] && (
                  <FontAwesomeIcon className="pr-4" icon={faAngleUp} />
                )}
              </CollapsedMenuItemAction>
            </CollapsedMenuItemRoot>

            {item.subitems && (
              <Collapse in={openMenus[index]} timeout="auto" unmountOnExit>
                {item.subitems.map((item) => {
                  const collpseLocationActive = localtion.pathname === item.path;

                  return (
                    <CollapsedMenuItemRoot isSub key={item.path} label={item.label}>
                      <CollapsedMenuItemAction
                        active={collpseLocationActive ? 'true' : 'false'}
                        onClick={() => handleNavigate(item.path)}
                      >
                        <CollapsedMenuItemIcon active={collpseLocationActive} icon={item.icon} />
                        <CollapsedMenuItemLabel active={isLocationActive}>{item.label}</CollapsedMenuItemLabel>
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
