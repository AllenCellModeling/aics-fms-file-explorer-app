import { map } from "lodash";
import * as React from "react";

import Annotation from "../../entity/Annotation";

import { FmsFile } from "./useFileFetcher";

/**
 * Contextual data passed to LazilyRenderedRows by react-window. Basically a light-weight React context. The same data
 * is passed to each LazilyRenderedRow.
 */
export interface LazilyRenderedRowContext {
    displayAnnotations: Annotation[];
    files: Map<number, FmsFile>;
    level: number; // maps to how far indented the first column of the file row should be to
}

interface LazilyRenderedRowProps {
    data: LazilyRenderedRowContext; // injected by react-window
    index: number; // injected by react-window
    style: React.CSSProperties; // injected by react-window
}

/**
 * A single file in the listing of available files FMS.
 */
export default function LazilyRenderedRow(props: LazilyRenderedRowProps) {
    const {
        data: { displayAnnotations, files },
        index,
        style,
    } = props;

    let content;

    const file = files.get(index);
    if (file) {
        const displayValues = map(displayAnnotations, (annotation) =>
            annotation.getDisplayValue(file)
        );
        content = displayValues.join(" | ");
    } else {
        content = "Loading...";
    }

    return <div style={style}>{content}</div>;
}