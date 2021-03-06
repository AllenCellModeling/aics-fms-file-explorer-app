import * as classNames from "classnames";
import { map, some } from "lodash";
import * as React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import DnDListItem from "./DnDListItem";

const styles = require("./DnDList.module.css");

interface Item {
    id: string;
    description: string;
    title: string;
}

interface ItemRendererParams {
    disabled: boolean;
    item: Item;
}

interface DnDListProps {
    className?: string;
    disabledItems?: Item[];
    highlight?: boolean;
    id: string;
    isDropDisabled?: boolean;
    items: Item[];
    itemRenderer: React.FunctionComponent<ItemRendererParams>;
}

/**
 * Wrapper for react-beautiful-dnd that renders a list of items that are draggable and droppable.
 */
export default function DnDList(props: DnDListProps) {
    const { disabledItems, highlight, id, isDropDisabled, items, itemRenderer } = props;
    return (
        <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
            {(droppableProps, droppableState) => (
                <ul
                    ref={droppableProps.innerRef}
                    className={classNames(
                        styles.list,
                        {
                            [styles.dropIndicator]:
                                !isDropDisabled && (highlight || droppableState.isDraggingOver),
                        },
                        props.className
                    )}
                >
                    {map(items, (item, index) => {
                        const disabled = some(disabledItems, (disabled) => disabled.id === item.id);
                        return (
                            <Draggable
                                key={item.id}
                                draggableId={`${id}_${item.id}`}
                                index={index}
                                isDragDisabled={disabled}
                            >
                                {(draggableProps, draggableState) => (
                                    <>
                                        <DnDListItem
                                            ref={draggableProps.innerRef}
                                            draggableProps={draggableProps.draggableProps}
                                            dragHandleProps={draggableProps.dragHandleProps}
                                        >
                                            {React.createElement(itemRenderer, { item, disabled })}
                                        </DnDListItem>
                                        {// Render static clone of item (i.e., not draggable) in a non-droppable list to prevent react-beautiful-dnd from leaving a hole in the source list when an item is actively being dragged out of it.
                                        // See https://github.com/atlassian/react-beautiful-dnd/issues/216 for context.
                                        isDropDisabled && draggableState.isDragging && (
                                            <DnDListItem
                                                className={classNames(
                                                    styles.listItemPlaceholder,
                                                    styles.disabled
                                                )}
                                            >
                                                {React.createElement(itemRenderer, {
                                                    item,
                                                    disabled,
                                                })}
                                            </DnDListItem>
                                        )}
                                    </>
                                )}
                            </Draggable>
                        );
                    })}
                    {droppableProps.placeholder}
                </ul>
            )}
        </Droppable>
    );
}

DnDList.defaultProps = {
    disabledItems: [],
    highlight: false,
    isDropDisabled: false,
};
