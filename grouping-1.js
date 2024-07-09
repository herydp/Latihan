import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  scenarios: {
    my_web_test: {
      exec: 'webtest',
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '1s'
    },
  },
};

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }

const url = 'https://be-tmdigital.stagingapps.net/login';
// const url2 = 'https://be-tmdigital.stagingapps.net/usercms/add';

export function webtest() {
  let data = {
    emailOrPhone: "superadmin@gmail.com",
    password: "superadmin"
  };

  // Menggunakan string JSON sebagai body
  let res = http.post(url, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });

  // Memeriksa apakah login berhasil
  check(res, {
    'login berhasil': (r) => r.status === 200,
  });

  let token = res.json('access_token');
  console.log(`Access Token: ${token}`);

  // let data2 = {
  //   name: "Hery Dp",
  //   username: "herydwipryono",
  //   email: "herydwipryono1505@gmail.com",
  //   role: "Admin"
    
  // };

  // Memastikan token ada sebelum melanjutkan
  if (token) {
    let res_form = http.post(url2, JSON.stringify(data2), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Memeriksa apakah pengisian form berhasil
    check(res_form, {
      'add user': (r) => r.status === 200,
    });
    console.log(`Form Submission Response: ${res_form.body}`);
  } else {
    console.error('Token tidak ditemukan, tidak dapat melanjutkan pengisian form.');
  }

  sleep(1);
}
