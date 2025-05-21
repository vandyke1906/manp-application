import { API_URL } from "./Common";

export function fetchBusinessTypes(){
    return fetch(`${API_URL}/business-types`).then((response) => response.json());
}

export function getBusinessType(id){
    return fetch(`${API_URL}/business-types/${id}`).then((response) => {
        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.response = response; // Attach the response to the error
            throw error;
        }   
        return response.json();
    });
}

export function createBusinessType(obj = {}){
    return fetch(`${API_URL}/business-types`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function updateBusinessType(obj = {}){
    return fetch(`${API_URL}/business-types/${obj.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function deleteBusinessType(obj = {}){
    return fetch(`${API_URL}/business-types/${obj.id}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }
    }).then((response) => {
        if (!response.ok) {
        throw new Error(`Failed to delete business type. Status: ${response.status}`);
        }    
        return { success: true };  
    });
}