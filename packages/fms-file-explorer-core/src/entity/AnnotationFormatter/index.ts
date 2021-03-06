import dateTimeFormatter from "./date-time-formatter";
import identityFormatter from "./identity-formatter";
import numberFormatter from "./number-formatter";

export enum AnnotationType {
    DATE = "Date",
    DATETIME = "Date/Time",
    NUMBER = "Number",
    STRING = "Text",
    BOOLEAN = "Yes/No",
}

export interface AnnotationFormatter {
    (value: any, unit?: string): string;
}

/**
 * Factory to return annotation formatter functions. Annotation formatters are responsible for accepting some value and
 * readying that value for presentation according to the values intended type.
 */
export default function annotationFormatterFactory(type: string): AnnotationFormatter {
    switch (type) {
        case AnnotationType.DATE:
        // prettier-ignore
        case AnnotationType.DATETIME: // FALL-THROUGH
            return dateTimeFormatter;
        case AnnotationType.NUMBER:
            return numberFormatter;
        case AnnotationType.STRING:
        // prettier-ignore
        default: // FALL-THROUGH
            return identityFormatter;
    }
}
