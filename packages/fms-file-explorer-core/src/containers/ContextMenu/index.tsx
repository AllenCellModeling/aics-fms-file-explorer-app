import {
    ContextualMenu,
    initializeIcons,
    IContextualMenuItem,
    loadTheme,
    Target,
    ContextualMenuItemType as _ContextualMenuItemType,
} from "office-ui-fabric-react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { interaction } from "../../state";

export type ContextMenuItem = IContextualMenuItem;
export type PositionReference = Target;
export const ContextualMenuItemType = _ContextualMenuItemType;

initializeIcons();
loadTheme({
    defaultFontStyle: {
        fontFamily: "Overpass",
    },
});

/**
 * Facade for office-ui-fabric-react's ContextualMenu component. Rendered in response to `contextmenu` events (e.g., right-clicks).
 * On dismiss, it will hide itself.
 */
export default function ContextMenu() {
    const dispatch = useDispatch();
    const items = useSelector(interaction.selectors.getContextMenuItems);
    const positionReference = useSelector(interaction.selectors.getContextMenuPositionReference);
    const visible = useSelector(interaction.selectors.getContextMenuVisibility);

    return (
        <ContextualMenu
            items={items}
            hidden={!visible}
            target={positionReference}
            onDismiss={() => dispatch(interaction.actions.hideContextMenu())}
        />
    );
}
