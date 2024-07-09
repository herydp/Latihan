import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from 'k6/http';
import { check, group, fail } from 'k6';

export const options = {
    vus: 2,
    iterations: 2
};

// Create a random string of given length
function randomString(length, charset = '') {
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    while (length--) res += charset[(Math.random() * charset.length) | 0];
    return res;
}

const BASE_URL = 'https://be-tmdigital.stagingapps.net';

// Register a new user and retrieve authentication token for subsequent API requests
export function setup() {
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


export default (authToken) => {
    // set the authorization header on the session for the subsequent requests
    const requestConfig = () => ({
        headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json' // Sesuaikan dengan tipe konten yang diharapkan oleh server
        },
    });

    let nameUser = '';
    let idUser = '';

    group('01. Create a new user', () => {
        // Setup payload as json
        const tempRandomString = randomString(10); 
        nameUser = `Name ${tempRandomString}`;
        const payload = JSON.stringify({
            name: nameUser,
            username: `Username ${tempRandomString}`,
            email: `${tempRandomString}@gmail.com`,
            role: `guest`,
        });

        // let => bisa berubah-rubah (Variable)
        // const  => gak bisa diubah (Konstanta)
        // string ('', "", ``), number (1, 1.1, 1f, 100_00), object ({}, {[]})

        // Variable scope 
    
        const res = http.post(`${BASE_URL}/usercms/add`, payload, requestConfig());
 
        // Check API response
        if (!check(res, { 'New User created correctly': (r) => r.status === 200 })) {
            console.log(`Unable to create a New User ${res.status} ${res.body}`);
            return;
        }

        console.log(`User created: ${nameUser}`)
        //console.log(res.status);
        //console.log(res.body);
    });


    group('02. Search user', () => {
        // Setup search URL
        // /usercms/get/name => path
        // ?name=fasdfas => query parameter
        
        const url = new URL(`${BASE_URL}/usercms/get/name`);
        url.searchParams.append('name', nameUser);

        const res = http.get(url.toString(), requestConfig());
        const content = res.json('content');

        if(check(res, {
            'Data not empty': () => content.length > 0,
            'Data found': () => content[0].name === nameUser,
        })) { 
            idUser = content[0].id;
        } else {
            console.log(`Unable to found the user ${res.status} ${res.body}`);
            return;
        }
    });

    group('03. Update user', () => {
        const url = new URL(`${BASE_URL}/usercms/edit/${idUser}`);

        const tempRandomString = randomString(10);
        const updatedNameUser = `Name ${tempRandomString}`;
        const payload = JSON.stringify({
            name: updatedNameUser,
            username: `Username ${tempRandomString}`,
            email: `${tempRandomString}@gmail.com`,
            role: `guest`,
        });

        const res = http.put(url.toString(), payload, requestConfig());

        const isSuccessfulUpdate = check(res, {
            'Update worked': () => res.status === 200,
            'Updated is successfull': () => res.json('message') === 'User updated!'
        });

        if (!isSuccessfulUpdate) {
            console.log(`Unable to update the user ${res.status} ${res.body}`);
            return;
        }

        console.log(`User Updated: ${nameUser} to new user ${updatedNameUser}`)
    });

    // group('04. Delete the user', () => {
    //     const url = new URL(`${BASE_URL}/usercms/delete/${idUser}`);
    //     const res = http.put(url.toString(), '', {        
    //         headers: {
    //             Authorization: `Bearer ${authToken}`,
    //         },
    //     });

    //     const isSuccessfullDelete = check(null, {
    //         'User was deleted correctly': () => res.status === 200,
    //         'Successfull to deleted the User': () => res.json('message') === 'User deleted!'
    //     });

    //     if (!isSuccessfullDelete) {
    //         console.log(`User was not deleted properly`);
    //         return;
    //     }
    // });

};
