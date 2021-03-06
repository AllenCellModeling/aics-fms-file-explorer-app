import * as classNames from "classnames";
import * as React from "react";
import { useSelector } from "react-redux";
import { VariableSizeList } from "react-window";

import DirectoryTreeNode from "./DirectoryTreeNode";
import * as directoryTreeSelectors from "./selectors";
import useLayoutMeasurements from "../../hooks/useLayoutMeasurements";

interface FileListProps {
    className?: string;
}

const COLLAPSED_DIRECTORY_TREE_NODE_HEIGHT = 0; // in px
const DEFAULT_DIRECTORY_TREE_NODE_HEIGHT = 35; // in px
const EXPANDED_FILE_LIST_HEIGHT = 300; // in px

/**
 * Central UI dedicated to showing lists of available files in FMS. Can be a flat list in the case that no annotation
 * hierarchies have been applied, or nested in the case that the user has declared how (i.e., by which annotations) the
 * files should be grouped. E.g.:
 *
 * [collapsible folder] ScientistA
 *      [collapsible folder] plate123
 *      [collapsible folder] plate456
 *      [collapsible folder] plate789
 * [collapsible folder] ScientistB
 *      [collapsible folder] plate123
 *      [collapsible folder] plate456
 *      [collapsible folder] plate789
 */
export default function DirectoryTree(props: FileListProps) {
    const [ref, containerHeight] = useLayoutMeasurements<HTMLDivElement>();

    const directoryTree = useSelector(directoryTreeSelectors.getDirectoryTree);

    const listRef = React.useRef<VariableSizeList>(null);
    const [collapsed, setCollapsed] = React.useState(() => new Map<number, boolean>());

    // when the directoryTree data structure changes, the previous state regarding which directories are
    // collapsed is invalid and needs to be reset.
    React.useEffect(() => {
        setCollapsed((prevCollapsed) => {
            if (prevCollapsed.size > 0) {
                return new Map<number, boolean>();
            }

            return prevCollapsed;
        });
        if (listRef.current) {
            listRef.current.resetAfterIndex(0, false);
        }
    }, [directoryTree, listRef]);

    // passed as onClick handler to individual nodes in the directory tree
    const setCollapsedAtIndex = (index: number) => {
        setCollapsed((prevCollapsedState) => {
            const nextCollapsedState = new Map(prevCollapsedState.entries());
            const fileSetTreeNode = directoryTree.get(index);

            // defensive condition, included only for the type checker--should never hit
            if (!fileSetTreeNode) {
                return prevCollapsedState;
            }

            let prevState = nextCollapsedState.get(index);
            // if collapsed state has not yet been explicitly set at this index, it should be treated as:
            // true, in the case that it is a leaf node (renders a set of files)
            // false, in the case that is not a leaf node
            if (prevState === undefined) {
                prevState = fileSetTreeNode.isLeaf;
            }

            nextCollapsedState.set(index, !prevState);
            return nextCollapsedState;
        });
        if (listRef.current) {
            listRef.current.resetAfterIndex(index, true);
        }
    };

    const isCollapsed = (index: number | null): boolean => {
        // `index` will be null when checking for ancestral collapsed state. That is, FileSetTreeNode::parent will eventually be `null`.
        if (index === null) {
            return false;
        }

        const fileSetTreeNode = directoryTree.get(index);

        // defensive condition, included only for the type checker--should never hit
        if (!fileSetTreeNode) {
            return false;
        }

        // never collapse root dir
        if (fileSetTreeNode.isRoot) {
            return false;
        }

        // if parent (or grand-, or great-grand parent) is collapsed, this node should be collapsed as well
        if (isCollapsed(fileSetTreeNode.parent)) {
            return true;
        }

        // if user has explicitly collapsed this node, defer to user's selection
        const isCollapsedAtIndex = collapsed.get(index);
        if (isCollapsedAtIndex !== undefined) {
            // unfortunately Map::has does not act as a type guard so need to do an explicit undefined check
            return isCollapsedAtIndex;
        }

        // by default, collapse the tree's leaves (sets of files)
        if (fileSetTreeNode.isLeaf) {
            return true;
        }

        // otherwise, the trees branches default to open
        return false;
    };

    return (
        <div className={classNames(props.className)} ref={ref}>
            <VariableSizeList
                ref={listRef}
                height={containerHeight}
                itemCount={directoryTree.size}
                itemData={{
                    directoryTree,
                    isCollapsed,
                    onClick: setCollapsedAtIndex,
                }}
                itemSize={(index) => {
                    const node = directoryTree.get(index);

                    // defensive condition, included only for the type checker--should never hit
                    if (!node) {
                        return COLLAPSED_DIRECTORY_TREE_NODE_HEIGHT;
                    }

                    // root dir should take up full height
                    if (node.isRoot) {
                        return containerHeight;
                    }

                    if (isCollapsed(node.parent)) {
                        return COLLAPSED_DIRECTORY_TREE_NODE_HEIGHT;
                    }

                    // if leaf of tree and expanded, expand to some constant height
                    if (node.isLeaf && !isCollapsed(index)) {
                        return EXPANDED_FILE_LIST_HEIGHT;
                    }

                    // by default, render to some arbitrary constant height
                    return DEFAULT_DIRECTORY_TREE_NODE_HEIGHT;
                }}
                width="100%"
            >
                {DirectoryTreeNode}
            </VariableSizeList>
        </div>
    );
}
