import Annotation from "../../entity/Annotation";

import { makeConstant } from "../util";

const STATE_BRANCH_NAME = "selection";

/**
 * SELECT_DISPLAY_ANNOTATION
 *
 * Intention to select one or many annotations for a file to display in the file list (i.e., as a column).
 *
 * For example, by default, we may only see "File name | File size | Date created" as the columns in the file list. This
 * is the mechanism for a user to then add or remove a column to view.
 */
export const SELECT_DISPLAY_ANNOTATION = makeConstant(
    STATE_BRANCH_NAME,
    "select-display-annotation"
);

export interface SelectDisplayAnnotationAction {
    payload: Annotation | Annotation[];
    type: string;
}

export function selectDisplayAnnotation(
    annotation: Annotation | Annotation[]
): SelectDisplayAnnotationAction {
    return {
        payload: annotation,
        type: SELECT_DISPLAY_ANNOTATION,
    };
}

/**
 * DESELECT_DISPLAY_ANNOTATION
 *
 * Intention to deselect one or many annotations from the columns of the file list. See comment for
 * SELECT_DISPLAY_ANNOTATION for further explanation.
 */

export const DESELECT_DISPLAY_ANNOTATION = makeConstant(
    STATE_BRANCH_NAME,
    "deselect-display-annotation"
);

export interface DeselectDisplayAnnotationAction {
    payload: Annotation | Annotation[];
    type: string;
}

export function deselectDisplayAnnotation(
    annotation: Annotation | Annotation[]
): DeselectDisplayAnnotationAction {
    return {
        payload: annotation,
        type: DESELECT_DISPLAY_ANNOTATION,
    };
}
