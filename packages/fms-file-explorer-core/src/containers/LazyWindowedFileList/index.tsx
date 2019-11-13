import * as classNames from "classnames";
import * as debouncePromise from "debounce-promise";
import * as React from "react";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

import Annotation from "../../entity/Annotation";
import FileSet from "../../entity/FileSet";
import { ColumnWidths } from "../FileList/useResizableColumns";
import useLayoutMeasurements from "../../hooks/useLayoutMeasurements";
import LazilyRenderedRow from "./LazilyRenderedRow";
import useFileSelector from "./useFileSelector";

const styles = require("./style.module.css");

const DEBOUNCE_WAIT_FOR_DATA_FETCHING = 50; // ms

interface LazyWindowedFileListProps {
    columnWidths: ColumnWidths;
    className?: string;
    displayAnnotations: Annotation[];
    fileSet: FileSet;
    level: number; // maps to how far indented the first column of the file row should be
    rowHeight: number; // how tall each row of the list will be, in px
    rowWidth: number; // how wide each of the list will be, in px
}

/**
 * Wrapper for react-window-infinite-loader and react-window that knows how to lazily fetch its own data. It will lay
 * itself out to be 100% the height and width of its parent.
 */
export default function LazyWindowedFileList(props: LazyWindowedFileListProps) {
    const {
        columnWidths,
        className,
        displayAnnotations,
        fileSet,
        level,
        rowHeight,
        rowWidth,
    } = props;

    const [ref, height] = useLayoutMeasurements<HTMLDivElement>();
    const onSelect = useFileSelector(fileSet);

    return (
        <div className={classNames(styles.list, className)} ref={ref}>
            <InfiniteLoader
                isItemLoaded={fileSet.isLoaded}
                loadMoreItems={debouncePromise(fileSet.fetchFiles, DEBOUNCE_WAIT_FOR_DATA_FETCHING)}
                itemCount={fileSet.totalCount}
            >
                {({ onItemsRendered, ref }) => (
                    <FixedSizeList
                        itemData={{
                            columnWidths,
                            displayAnnotations,
                            files: fileSet.files,
                            level,
                            onSelect,
                            rowWidth,
                        }}
                        itemSize={rowHeight} // row height
                        height={height} // height of the list itself; affects number of rows rendered at any given time
                        itemCount={fileSet.totalCount}
                        onItemsRendered={onItemsRendered}
                        ref={ref}
                        style={{ overflowX: "hidden" }} // if the window is resized such that the LazyWindowedFileList is wider than its container, the user will be able to use the scrollbar that will be rendered in the container
                        width={rowWidth}
                    >
                        {LazilyRenderedRow}
                    </FixedSizeList>
                )}
            </InfiniteLoader>
        </div>
    );
}

LazyWindowedFileList.defaultProps = {
    level: 0,
    rowHeight: 30,
};
