import { useState, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { ApiClient } from "../../_utils/axios";
import Spinner from "../spinner/Spinner";

const FilePreview = ({ applicationId, fileName }) => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
    });
}

    useEffect(() => {
        ApiClient.get(`applications-file/${applicationId}/${fileName}`, { responseType: "blob" })
            .then((response) => {
                console.info({ response });
                blobToBase64(response.data).then((base64File) => {
                    const fileType = response.data.type; // MIME type

                    console.info({fileUrl: base64File, fileType});
                    
                    setDocs([{ uri: base64File, fileType }]);
                    setLoading(false);
                });
            })
            .catch((error) => {
                console.error("Error fetching file:", error);
                setLoading(false);
            });
    }, [applicationId, fileName]);

    return loading ?  <Spinner /> :<DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
};

export default FilePreview;