import { API_URL } from "./Common";

export function fetchApplicationTypes(){
    return fetch(`${API_URL}/application-types`).then((response) => response.json());
}

export function getApplicationType(id){
    return fetch(`${API_URL}/application-types/${id}`).then((response) => {
        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.response = response; // Attach the response to the error
            throw error;
        }      
        return response.json();
    });
}

export function createApplicationType(obj = {}){
    return fetch(`${API_URL}/application-types`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function updateApplicationType(obj = {}){
    return fetch(`${API_URL}/application-types/${obj.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function deleteApplicationType(obj = {}){
    return fetch(`${API_URL}/application-types/${obj.id}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }
    }).then((response) => {
        if (!response.ok) {
        throw new Error(`Failed to delete Application Type. Status: ${response.status}`);
        }    
        return { success: true };  
    });
}