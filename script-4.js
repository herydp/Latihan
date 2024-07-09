import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const responses = http.batch([
    ['GET', 'https://test.k6.io', null, { tags: { ctype: 'html' } }],
    ['GET', 'https://test.k6.io/style.css', null, { tags: { ctype: 'css' } }],
    ['GET', 'https://test.k6.io/images/logo.png', null, { tags: { ctype: 'images' } }],
  ]);
  check(responses[0], {
    'first API main page status was 200': (res) => res.status === 200,
  });
  check(responses[1], {
    'second API main page status was 200': (res) => res.status === 200,
  });
  check(responses[2], {
    'Third API main page status was 200': (res) => res.status === 200,
  });
}
