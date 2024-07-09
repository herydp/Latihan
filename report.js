grooping1.js
import http from 'k6/http';
import { sleep, expect, describe, check } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {
  randomIntBetween,
  randomItem,
} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export function setup() {
  console.log('Setup function is running...');

  // Konfigurasi HTTP endpoint yang akan diuji
  let baseURL = 'https://be-tmdigital.stagingapps.net';

  // Set konfigurasi kustom jika diperlukan (misalnya, timeout atau pengaturan lainnya)
  // http.settings.defaultHeaders['Authorization'] = 'Bearer myAuthToken';
  // http.settings.timeout = 10000; // Set timeout menjadi 10 detik
  
  // Menyimpan baseURL dan konfigurasi lainnya ke dalam objek
  return { baseURL: baseURL };
  sleep(5);
  
}

export const options = {
    vus: 10,
    duration: '60s',
 
 
    thresholds: {
      http_req_failed: ['rate<0.001'], // rate error harus kurang dari 0.1%
      http_req_duration: ['p(90)<2000'], // 90% of requests harus kumplit sebelum 2000ms
      http_req_receiving: ['max<17000'], // max receive request kurang dari 17000ms
     },
     
 };

 export function handleSummary(data) {
    return {
      "report.html": htmlReport(data),
    };
  }

let token;
let name;
let id;


export default function () {
  let data = setup();
  describe('login user', () => {
    //let response = http.post(apiUrl, JSON.stringify(userData), { headers: headers });
    let url = data.baseURL + '/access/login';
    // Data yang akan dikirimkan sebagai payload (misalnya, dalam format JSON)
    let payload = JSON.stringify({
        email: 'superadmin@gmail.com',
        password: 'superadmin'
        
    });

    // Header untuk menentukan tipe konten (Content-Type)
    let headers = {
        'Content-Type': 'application/json' // Sesuaikan dengan tipe konten yang diharapkan oleh server
    };

    // Kirim permintaan HTTP untuk login dengan header yang ditentukan
    let response = http.post(url, payload, { headers: headers });

    // Tampilkan respons dan kode status

    console.log('Response body:', response.body);
    console.log('Status code:', response.status);
    token = response.json().token
    console.log(token);
    
    // Periksa respons atau lakukan pengukuran kinerja
    expect(response.status, 'response status').to.equal(200);
    if (response.status === 200) {
        console.log('Login successful!'); // Atau lakukan tindakan lanjutan setelah login berhasil
    } else {
        console.log('Login failed!');
    }

});

describe("Create User", () => {
  console.log(`Create User`);
  name = `QA${randomIntBetween(1, 100000000)}`;
  let role = randomItem(["qa", "Guest"]);
  let path = data.baseURL + `/usercms/add`;
  let body = JSON.stringify({
      "name": `${name}`,
      "username": `${name} ${role}`,
      "email": `${name}@mail.test`,
      "role": `${role}`
  });
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  };
  let response = http.post(path, body, { headers: headers });
  let content = response.json().message;
  if (response.status === 200) {
      expect(response.status, 'response status').to.equal(200);
      console.log(`Status Respons: ${response.status} OK`);
      console.log(`Message: ${content}`);
  } else {
      console.log(`Response not OK`);
  }
});

describe(`Get User by Name: ${name}`, () => {
  console.log(`Get User by Name: ${name}`);
  let path = data.baseURL + `/usercms/get/name/?name=${name}`;
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  };
  let response = http.get(path, { headers: headers });
  id = response.json().content[0].id;
  if (response.status === 200) {
      expect(response.status, 'response status').to.equal(200);
      console.log(`Status Respons: ${response.status} OK`);
      console.log(`User: ${id} - ${name}`)
  } else {
      console.log(`Get user by name failed`);
  }
});

describe(`Delete User with ID : ${id}`, () => {
  console.log(`Delete User: ${name}`);
  let path = data.baseURL + `/usercms/delete/${id}`;
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  };
  let response = http.put(path, null, { headers: headers });
  if (response.status === 200) {
      expect(response.status, 'response status').to.equal(200);
      console.log(`Status Respons: ${response.status} OK`);
      console.log(`User: ${id}`)
      console.log(`User ${id} deleted successfully`);
  } else {
      console.error(`Failed to delete user ${id}: ${response.status} - ${response.body}`);
  }
});



}