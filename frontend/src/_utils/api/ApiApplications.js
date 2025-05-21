import { API_URL } from "./Common";

export function fetchApplications(){
    return fetch(`${API_URL}/applications`).then((response) => response.json());
}

export function getApplication(id){
    return fetch(`${API_URL}/applications/${id}`).then((response) => {
        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.response = response; // Attach the response to the error
            throw error;
        }  
    
        return response.json();
    })
}

export function createApplication(obj = {}){
    return fetch(`${API_URL}/applications`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function updateApplication(obj = {}){
    return fetch(`${API_URL}/applications/${obj.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function deleteApplication(obj = {}){
    return fetch(`${API_URL}/applications/${obj.id}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }
    }).then((response) => {
        if (!response.ok) {
        throw new Error(`Failed to delete zoning. Status: ${response.status}`);
        }    
        return { success: true };  
    });
}