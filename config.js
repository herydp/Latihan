import http from 'k6/http';
import { check } from 'k6';


const BASE_URL = 'https://be-tmdigital.stagingapps.net';

// Fungsi lgin yang mengembalikan auth token
export function login() {
    let payload = JSON.stringify({
        email: 'superadmin@gmail.com',
        password: 'superadmin'
    });
  

    let headers = {
        'Content-Type': 'application/json' // Sesuaikan dengan tipe konten yang diharapkan oleh server
    };

    const loginRes = http.post(`${BASE_URL}/access/login/`, payload, {headers});

    //console.log(payload, loginRes.body);

    const authToken = loginRes.json('token');
    
    //console.log(authToken); // Print value auth token from response
    
    check(authToken, { 'logged in successfully': () => authToken !== '' });

    return authToken;
}