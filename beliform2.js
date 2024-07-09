import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
   

  scenarios: {
    my_web_test: {
      exec: 'webtest',
      executor: 'per-vu-iterations',
      vus: 3,
      iterations: 1,
      maxDuration: '10s'
    },
  },
   
};



const url = 'https://be-tmdigital.stagingapps.net/access/login';
const url2 = 'https://be-tmdigital.stagingapps.net/usercms/add';
// const url3 = 'https://be-tmdigital.stagingapps.net/usercms/get/name?name=hery'

export function webtest() {
  let data = {
    email: "superadmin@gmail.com",
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

  let token = res.json('token');
  console.log(`token: ${token}`);

  let data2 = {
    name: "herydp",
    username: "herydwipryono",
    email: "hery.pryono@wgs-id.com",
    role: "guest"
    
  };

  // Memastikan token ada sebelum melanjutkan
  if (token) {
    let res_form = http.post(url2, JSON.stringify(data2), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      }
    });
  }
  sleep(1);
}
