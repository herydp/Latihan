import http from 'k6/http';
import { check, sleep, fail } from 'k6';

// Variabel global
const BASE_URL = 'https://ipeka-pmb.stagingapps.net';
const HEADERS = {
    'Content-Type': 'application/json',
};

// Kelas WebTest
class WebTest {
    constructor(baseURL, headers) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    // Metode untuk memuat halaman beranda
    // loadHomePage() {
    //     const url = `${this.baseURL}`;
    //     const response = http.get(url, { headers: this.headers });
    //     console.log(`Home Page Response: ${response.status} ${response.body}`);
    //     check(response, {
    //         'status is 200': (r) => r.status === 200,
    //         'homepage loaded': (r) => r.body.includes('Welcome to Example.com'),
    //     }) || fail('Failed to load home page');
    //     return response;
    // }

    // Metode untuk memuat halaman login
    loadLoginPage() {
        const url = `${this.baseURL}/login`;
        const response = http.get(url, { headers: this.headers });
        console.log(`Login Page Response: ${response.status} ${response.body}`);
        check(response, {
            'status is 200': (r) => r.status === 200,
            'login page loaded': (r) => r.body.includes('Login to your account'),
        }) || fail('Failed to load login page');
        return response;
    }

    // Metode untuk login
    login(emailOrPhone, password) {
        const url = `${this.baseURL}/login`;
        const payload = JSON.stringify({ emailOrPhone: emailOrPhone, password: password });
        const response = http.post(url, payload, { headers: this.headers });
        console.log(`Login Response: ${response.status} ${response.body}`);
        check(response, {
            'status is 200': (r) => r.status === 200,
            'login successful': (r) => r.body.includes('Welcome back'),
        }) || fail('Failed to login');
        return response;
    }

    // Metode untuk memuat halaman profil
    loadDashboardPage() {
        const url = `${this.baseURL}/profile`;
        const response = http.get(url, { headers: this.headers });
        console.log(`Profile Page Response: ${response.status} ${response.body}`);
        check(response, {
            'status is 200': (r) => r.status === 200,
            'profile page loaded': (r) => r.body.includes('Your Profile'),
        }) || fail('Failed to load profile page');
        return response;
    }
}

export let options = {
    vus: 1,
    duration: '5s',
};

export default function () {
    const webTest = new WebTest(BASE_URL, HEADERS);

    // // Memuat halaman beranda
    // webTest.loadHomePage();

    // Memuat halaman login
    webTest.loadLoginPage();

    // Melakukan login
    webTest.login('kuzanauokiji@harakirimail.com', '12345678');

    // Memuat halaman profil
    webTest.loadDashboardPage();

    sleep(1);
}
