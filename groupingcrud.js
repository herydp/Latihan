import http from 'k6/http';
import { check, sleep } from 'k6';

// Variabel global
const BASE_URL = 'https://be-tmdigital.stagingapps.net/usercms/add';
const LOGIN_URL = 'https://be-tmdigital.stagingapps.net/access/login';
const HEADERS = {
    'Content-Type': 'application/json',
};

// Kelas ApiTest
class ApiTest {
    constructor(baseURL, headers) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    // Metode untuk operasi login
    login(email, password) {
        const url = LOGIN_URL;
        const payload = JSON.stringify({ email: email, password: password });
        const response = http.post(url, payload, { headers: this.headers });
        check(response, {
            'login status is 200': (r) => r.status === 200,
        });
        const token = response.json('token');
        this.headers['Authorization'] = `Bearer ${token}`;
        return token;
    }

    // Metode untuk operasi Create (POST)
    createResource(resource, data) {
        const url = `${this.baseURL}/${resource}`;
        const response = http.post(url, JSON.stringify(data), { headers: this.headers });
        check(response, {
            'create status is 201': (r) => r.status === 201,
        });
        return response;
    }

    // Metode untuk operasi Read (GET)
    readResource(resource, id) {
        const url = `${this.baseURL}/${resource}/${id}`;
        const response = http.get(url, { headers: this.headers });
        check(response, {
            'read status is 200': (r) => r.status === 200,
        });
        return response;
    }

    // Metode untuk operasi Update (PUT)
    updateResource(resource, id, data) {
        const url = `${this.baseURL}/${resource}/${id}`;
        const response = http.put(url, JSON.stringify(data), { headers: this.headers });
        check(response, {
            'update status is 200': (r) => r.status === 200,
        });
        return response;
    }

    // Metode untuk operasi Delete (DELETE)
    deleteResource(resource, id) {
        const url = `${this.baseURL}/${resource}/${id}`;
        const response = http.del(url, null, { headers: this.headers });
        check(response, {
            'delete status is 200': (r) => r.status === 200,
        });
        return response;
    }
}

export let options = {
    vus: 1,
    duration: '10s',
};

export default function () {
    const apiTest = new ApiTest(BASE_URL, HEADERS);

    // Login
    const email = 'superadmin@gmail.com';
    const password = 'superadmin';
    const token = apiTest.login(email, password);

    if (!token) {
        console.error('Login gagal, token tidak ditemukan.');
        return;
    }

    // Data untuk operasi CRUD
    const createData = {
        name: "herydp",
        username: "herydwipryono",
        email: "hery.pryono@wgs-id.com",
        role: "guest"
    };

    // Create resource
    const createResponse = apiTest.createResource('users', createData);
    const createdId = createResponse.json('id');

    // Read resource
    apiTest.readResource('users', createdId);

    // Update resource
    const updateData = {
        name: "herydwipryono",
        username: "herdp",
        email: "hery.pryono@wgs-id.com",
        role: "guest"
    };
    apiTest.updateResource('users', createdId, updateData);

    // Delete resource
    apiTest.deleteResource('users', createdId);

    sleep(1);
}
