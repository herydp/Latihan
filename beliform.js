import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  // discardResponseBodies: true,
  scenarios: {
    my_web_test: {
      // exec: 'webtest',
      // executor: 'constant-vus',
      // vus: 200,
      // duration: '1m'

      // the function this scenario will execute
      exec: 'webtest',
      executor: 'per-vu-iterations',
      vus: 5,
      iterations: 1,
      maxDuration: '1s'
    },
  },
};

const url = 'https://pmb-ipeka-api.stagingapps.net/auth/login';
const url2 = 'https://pmb-ipeka-api.stagingapps.net/form';
// const url = 'http://satu-sehat-api-wgs.test/api/v3/auth/GetToken';

export function webtest() {
  let data = {
                emailOrPhone: "kuzanauokiji@harakirimail.com",
                password: "12345678"
              };

  // Using a JSON string as body
  let res = http.post(url, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });

let data2 = {
    schoolYear: "2024/2025",
    locationId: "01",
    location: "IPEKA Tomang",
    classId: "01250",
    class: "SD-5",
    studentName: "Agung Sulaksana",
    studentBirthDate: "2013-02-15",
    formPrice: 300000,
    submittedForm: "Website"

};

let res_gettoken = http.post(url2, JSON.stringify(data2), {
    headers: { 'Content-Type': 'application/json' }
});

  console.log(res.json('access_token')); // Bert
  // if(res.json('code') != 200){
  //   console.log(res); 
  // }
}