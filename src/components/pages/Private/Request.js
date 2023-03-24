import { API_URL } from "../../../variables";
import axios from 'axios';

export default class Request {

    static abortController = new AbortController();

    static async Post(path, body, headers = {}) {
        let token = localStorage.getItem("token");
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        headers = {
            "Accept": "application/json",
            ...headers
        }
        let response = await fetch(API_URL + path, {
            method: "POST",
            body: body,
            headers: headers,
            signal: this.abortController.signal
        })
            .then(async res => {
                res = await res.json()
                console.log(res);
                return res;
            })
            .then(json => (json))
            .catch(err => console.error("xo error!!! " + err.message));

        return response;
    }

    static async Get(path, headers = {}) {
        let token = localStorage.getItem("token");
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        headers = {
            "Accept": "application/json",
            ...headers
        }
        let response = await fetch(API_URL + path, {
            method: "GET",
            headers: headers,
            signal: this.abortController.signal
        })
            .then(res => res.json())
            .then(json => (json))
            .catch(err => console.error("xo error!!! " + err.message));

        return response;
    }

    static async GetFile(path, headers = {}) {
        let token = localStorage.getItem("token");
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        headers = {
            "Accept": "application/json",
            ...headers
        }
        let response = await fetch(API_URL + path, {
            method: "GET",
            headers: headers,
            signal: this.abortController.signal
        })
            .then(res => {
                console.log(res.body);
                return res.blob();
            })
            .then(json => (json))
            .catch(err => {
                console.log(err);
                console.error("xo error!!! " + err.message)
            });

        return response;
    }

    static async Delete(path, headers = {}) {
        let token = localStorage.getItem("token");
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        headers = {
            "Accept": "application/json",
            ...headers
        }
        let response = await fetch(API_URL + path, {
            method: "DELETE",
            headers: headers
        })
            .then(res => res.json())
            .then(json => (json))
            .catch(err => console.error("xo error!!! " + err.message));

        return response;
    }






    static async PostProgress(path, body, headers = {}, SetProgress = () => { }) {
        let token = localStorage.getItem("token");
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        headers = {
            "Accept": "application/json",
            ...headers
        }
        let response = await axios.post(API_URL + path, body, {
            headers: headers,
            onUploadProgress: (e) => {
                console.log(e);
                SetProgress((e.loaded / e.total) * 100);
            }
        })
            .then(res => {

                return res.data;
            })
            .then(json => (json))
            .catch(err => console.error("xo error!!! " + err.message));

        return response;
    }


    static async GetFileAxios(path, headers = {}) {
        let token = localStorage.getItem("token");
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        headers = {
            "Accept": "application/json",
            ...headers
        }
        let response = await axios.get(API_URL + path, {
            headers: headers,
            responseType: 'document'
        })
            .then(res => {

                return res.data;
            })
            .then(json => (json))
            .catch(err => console.error("xo error!!! " + err.message));



        return response;
    }

}