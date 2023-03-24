export const get = async (path) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Accept": "application/json",
        ...(token && {"Authorization": "Bearer " + token})
    };

    let response = await fetch(path, {
        method: "GET",
        headers: headers
    })
    .then(async (res) => await res.json())
    .catch(err => console.log("Error to get: " + err.message));

    return response;
}

export const post = async (path, body) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Accept": "application/json",
        ...(!(body instanceof FormData) && {"Content-type": "application/json"}),
        ...(token && {"Authorization": "Bearer " + token})
    };

    console.log(headers);
    console.log(body);
    
    let httpCode;
    let response = await fetch(path, {
        method: "POST",
        headers: headers,
        body: body
    })
    .then(async (res) => {
        httpCode = res.status;
        return await res.json();
    })
    .catch(err => console.log("Error to post: " + err.message));

    response["httpCode"] = httpCode;
    return response;
}

export const put = async (path, body) => {
    const headers = {
        "Accept": "application/json",
        ...(!(body instanceof FormData) && {"Content-type": "application/json"})
    }

    let response = await fetch(path, {
        method: "PUT",
        headers: headers,
        body: body
    })
    .then(async (res) => await res.json())
    .catch(err => console.log("Error to put: " + err.message));

    return response;
}

export const patch = async (path, body) => {
    const headers = {
        "Accept": "application/json",
        ...(!(body instanceof FormData) && {"Content-type": "application/json"})
    }
    
    let response = await fetch(path, {
        method: "PATCH",
        headers: headers,
        body: body
    })
    .then(async (res) => await res.json())
    .catch(err => console.log("Error to patch: " + err.message));

    return response;
}

export const useDelete = async (path, body) => {
    const headers = {
        "Accept": "application/json",
        "Content-type": "application/json"
    }

    let response = await fetch(path, {
        method: "DELETE",
        headers: headers,
        body: body
    })
    .then(async (res) => await res.json())
    .catch(err => console.log("Error to delete: " + err.message));

    return response;
}