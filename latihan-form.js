import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  // Request page containing a form
  let res = http.get('https://ipeka-cms.stagingapps.net/dashboard/pmb/examinees');

  // Now, submit form setting/overriding some fields of the form
  res = res.submitForm({
    formSelector: 'form',
    fields: { custname: 'test', extradata: 'test2' },
  });
  sleep(3);
}
