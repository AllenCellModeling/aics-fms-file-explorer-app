/**
 * Expected JSON response of a file detail returned from the query service. Example:
 * {
 *      // user defined
 *      annotations: [
 *          {
 *              annotation_id: 1,
 *              values: ["AICS_10", "AICS_12"],
 *              position: null,
 *              channel: null,
 *              time: null,
 *           },
 *          {
 *              annotation_id: 2,
 *              values: [true],
 *              position: null,
 *              channel: 1,
 *              time: null,
 *           },
 *          {
 *              annotation_id: 3,
 *              values: [true],
 *              position: 2,
 *              channel: null,
 *              time: null,
 *           },
 *      ],
 *      // acquisition metadata
 *      channels: [
 *          { id: 1, name: "GFP channel", laser_power: 10, exposure_time: 100 },
 *          { id: 2, name: "Brightfield", laser_power: 1, exposure_time: 10 },
 *      ],
 *      // acquisition metadata
 *      positions: [
 *          { id: 1, name: "Tiled region one", x: 3002382.939, y: 29384309328.2 },
 *          { id: 2, name: "Position 2", x: 93849.288, y: 710383.19 },
 *      ],
 *      // acquisition metadata
 *      time: [
 *          { id: 34, deltaT: "foobar" },
 *      ]
 *     fileId: "26aa7881b8004dd0bcec857baf9a2f0a",
 *     thumbnail: "src/of/thumbnail",
 *     "uploaded": "2019-08-15 13:50:24",
 *     "uploadedBy": "svc_airflow",
 * }
 */
interface Channel {
    [index: string]: any;
    id: string | number;
    name: string; // may be autogenerated, e.g. `Channel ${id}`
}

interface Position {
    [index: string]: any;
    id: string | number;
    name: string; // may be autogenerated, e.g. `Position ${id}`
}

interface Time {
    [index: string]: any;
    id: string | number;
}

interface AnnotationValue {
    annotation_id: number;
    values: (string | number | boolean)[];
    position: string | number | null; // maps to position.id
    channel: string | number | null; // maps to channel.id
    time: string | number | null; // maps to time.id
}

export interface FileDetailResponse {
    annotations: AnnotationValue[];
    channels: Channel[];
    file_id: string;
    positions: Position[];
    times: Time[];
    thumbnail: string;
    uploaded: string; // date/time
    uploadedBy: string; // user
}

/**
 * Facade for a FileDetailResponse.
 */
export default class FileDetail {
    private fileDetail: FileDetailResponse;

    constructor(fileDetail: FileDetailResponse) {
        this.fileDetail = fileDetail;
    }

    public get id() {
        return this.fileDetail.file_id;
    }

    public get thumbnail() {
        return this.fileDetail.thumbnail;
    }
}
