import Annotation from "../../entity/Annotation";
import RestServiceResponse from "../../entity/RestServiceResponse";

/**
 * Expected JSON structure of an annotation returned from the query service.
 */
export interface AnnotationResponse {
    annotation_display_name: string;
    annotation_name: string;
    description: string;
    type: string;
    units?: string;
    values: (string | number | boolean | Date)[];
}

/**
 * Service responsible for fetching annotation related metadata.
 */
export default class AnnotationService {
    private static BASE_ANNOTATION_URL = "api/1.0/annotations";

    /**
     * Fetch all annotations.
     */
    public static fetchAnnotations(): Promise<Annotation[]> {
        const requestUrl = `${AnnotationService.BASE_ANNOTATION_URL}`;
        console.log(`Requesting annotation values from ${requestUrl}`);

        // TEMPORARY, FLAT-FILE BASED IMPLEMENTATION UNTIL QUERY SERVICE EXISTS
        return new Promise<Annotation[]>((resolve) => {
            const response = new RestServiceResponse<AnnotationResponse>(
                require("../../../assets/annotations.json")
            );
            const annotations = response.data.map(
                (annotationResponse) => new Annotation(annotationResponse)
            );
            resolve(annotations);
        });
    }
}
