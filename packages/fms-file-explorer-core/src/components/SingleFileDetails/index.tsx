import * as React from "react";

import FileDetail from "../../entity/FileDetail";

const styles = require("./SingleFileDetails.module.css");

interface SingleFileDetailsProps {
    filename: string;
    details: FileDetail;
}

/**
 * Displays the full annotations for a single file.
 */
export default function SingleFileDetails({ filename, details }: SingleFileDetailsProps) {
    console.log(details);
    return (
        <div>
            <h3>{filename}</h3>
            <div>
                Created: {details.uploaded.toLocaleDateString("en-US")}
                Created By: {details.uploadedBy}
            </div>
            <ul>
                {details.annotations.map((annotation, index) => {
                    return <li key={index}>{JSON.stringify(annotation.values)}</li>;
                })}
            </ul>
        </div>
    );
}
