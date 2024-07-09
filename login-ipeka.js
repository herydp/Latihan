import http from 'k6/http';
import { check, sleep } from 'k6';

// Variabel global
const BASE_URL = 'https://pmb-ipeka-api.stagingapps.net/auth';
const HEADERS = {
    'Content-Type': 'application/json',
};

// Kelas WebTest
class WebTest {
    constructor(baseURL, headers) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    // Metode untuk memuat halaman login
    loadLoginPage() {
        const url = `${this.baseURL}/login`;
        const response = http.get(url, { headers: this.headers });
        check(response, {
            'status is 200': (r) => r.status === 200,
            //'login page loaded': (r) => r.body.includes('Login to your account'),
        });
       // return response;
    }

    // Metode untuk login
    login(emailOrPhone, password) {
        const url = `${this.baseURL}/login`;
        const payload = JSON.stringify({ emailOrPhone: emailOrPhone, password: password });
        const response = http.post(url, payload, { headers: this.headers });
    };

}

export let options = {
    vus: 1,
    duration: '5s',
};

export default function () {
    const webTest = new WebTest(BASE_URL, HEADERS);

    // Memuat halaman login
    webTest.loadLoginPage();

    // Melakukan login
    webTest.login('kuzanauokiji@harakirimail.com', '12345678');

    sleep(1);
}
