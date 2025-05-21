import { API_URL } from "./Common";

export function fetchZoning(){
    return fetch(`${API_URL}/zonings`).then((response) => response.json());
}

export function getZoning(id){
    return fetch(`${API_URL}/zonings/${id}`).then((response) => {
        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.response = response; // Attach the response to the error
            throw error;
        }   
    
        return response.json();
    })
}

export function createZoning(obj = {}){
    return fetch(`${API_URL}/zonings`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function updateZoning(obj = {}){
    return fetch(`${API_URL}/zonings/${obj.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function deleteZoning(obj = {}){
    return fetch(`${API_URL}/zonings/${obj.id}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }
    }).then((response) => {
        if (!response.ok) {
        throw new Error(`Failed to delete zoning. Status: ${response.status}`);
        }    
        return { success: true };  
    });
}