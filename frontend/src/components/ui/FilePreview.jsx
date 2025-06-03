import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import "../../_styles/doc-viewer.css";

const FilePreview = ({ docs = [] }) => {
    return  <DocViewer
        documents={docs} 
        pluginRenderers={DocViewerRenderers}
        config={{
            header: {
            disableHeader: false,
            disableFileName: false,
            retainURLParams: false
            }
        }}
        theme={{
            primary: "#5296d8",
            secondary: "#ffffff",
            tertiary: "#5296d899",
            text_primary: "#ffffff",
            text_secondary: "#5296d8",
            text_tertiary: "#00000099",
            disableThemeScrollbar: false,
        }}
    />
};

export default FilePreview;