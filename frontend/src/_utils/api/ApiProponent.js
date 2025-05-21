import { API_URL } from "./Common";

export function fetchProponents(){
    return fetch(`${API_URL}/proponents`).then((response) => response.json());
}

export function getProponent(id){
    return fetch(`${API_URL}/proponents/${id}`).then((response) => {
        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.response = response; // Attach the response to the error
            throw error;
        }    

        return response.json();
    }).catch(error => {
        console.info({error})
        throw error;
    })
}

export function createProponent(obj = {}){
    return fetch(`${API_URL}/proponents`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function updateProponent(obj = {}){
    return fetch(`${API_URL}/proponents/${obj.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj)
    }).then((response) => response.json());
}

export function deleteProponent(obj = {}){
    return fetch(`${API_URL}/proponents/${obj.id}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }
    }).then((response) => {
        if (!response.ok) {
        throw new Error(`Failed to delete proponent. Status: ${response.status}`);
        }    
        return { success: true };  
    });
}