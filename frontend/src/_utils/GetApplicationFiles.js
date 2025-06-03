import { useQueries } from "@tanstack/react-query";
import { ApiClient } from "./axios";
const fetchFile = async (applicationId, fileName) => {
    try {
        const response = await ApiClient.get(`applications-file/${applicationId}/${fileName}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching file: ${fileName}`, error);
        return null;
    }
};

const GetApplicationFiles = (applicationId) => {
    const fileNames = [
        "proof_of_capitalization",
        "barangay_clearance",
        "birth_certificate_or_id",
        "ncip_document",
        "fpic_certification",
        "business_permit",
        "authorization_letter"
    ];
    return useQueries({
        queries: fileNames.map((fileName) => {
            return {
                queryKey: ["application-file", applicationId, fileName],
                queryFn: () => fetchFile(applicationId, fileName),
                enabled: !!applicationId, // Ensures query runs only when `applicationId` is valid
                staleTime: 0, // Forces fresh fetch
                refetchOnMount: true, // Ensures queries run when component loads
            };
        })
    });
};

export default GetApplicationFiles;
