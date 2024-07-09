import http from 'k6/http';
import { check, sleep } from 'k6';

// Variabel global
const BASE_URL = 'https://ipeka-pmb.stagingapps.net';
const HEADERS = {
    'Content-Type': 'application/json',
};

// Kelas ApiTest
class ApiTest {
    constructor(baseURL, headers) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    // Metode untuk permintaan GET
    get(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        const response = http.get(url, { headers: this.headers });
        check(response, {
            'status is 200': (r) => r.status === 200,
        });
        return response;
    }

    // Metode untuk permintaan POST
    post(endpoint, payload) {
        const url = `${this.baseURL}${endpoint}`;
        const response = http.post(url, JSON.stringify(payload), { headers: this.headers });
        check(response, {
            'status is 200': (r) => r.status === 200,
        });
        return response;
    }

    // Metode untuk permintaan PUT
    put(endpoint, payload) {
        const url = `${this.baseURL}${endpoint}`;
        const response = http.put(url, JSON.stringify(payload), { headers: this.headers });
        check(response, {
            'status is 200': (r) => r.status === 200,
        });
        return response;
    }

    // Metode untuk permintaan DELETE
    delete(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        const response = http.del(url, null, { headers: this.headers });
        check(response, {
            'status is 200': (r) => r.status === 200,
        });
        return response;
    }
}

export let options = {
    vus: 5,
    duration: '5s',
};

export default function () {
    const apiTest = new ApiTest(BASE_URL, HEADERS);
    
    // Melakukan permintaan GET
    apiTest.get('/users');

    // Melakukan permintaan POST
    apiTest.post('/users', { name: 'John Doe', age: 30 });

    // Melakukan permintaan PUT
    apiTest.put('/users/1', { name: 'Jane Doe', age: 25 });

    // Melakukan permintaan DELETE
    apiTest.delete('/users/1');
    
    sleep(1);
}
