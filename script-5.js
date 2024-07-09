import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 5, // Number of virtual users
  duration: '5s', // Duration of the test
};

export default function () {
  // Make a GET request to fetch the image
  const response = http.get('https://example.com/image.jpg');

  // Check if the request was successful
  check(response, {
    'Status is 200': (res) => res.status === 200,
  });

  // Check if the response content type is an image
  check(response, {
    'Content-Type is image/jpeg': (res) => res.headers['Content-Type'] === 'image/jpeg',
  });
}
