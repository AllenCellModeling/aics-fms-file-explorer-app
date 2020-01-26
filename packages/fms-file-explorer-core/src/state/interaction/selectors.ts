import { State } from "../";

// BASIC SELECTORS
export const getContextMenuVisibility = (state: State) => state.interaction.contextMenuIsVisible;
export const getContextMenuItems = (state: State) => state.interaction.contextMenuItems;