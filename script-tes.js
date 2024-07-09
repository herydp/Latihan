import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  // Generate random user data
  let userData = generateUserData();

  // Send HTTP request with user data
  let response = http.post('https://example.com/api/users', JSON.stringify(userData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Print response
  console.log('Response status code:', response.status);

  // Sleep for a short period between requests
  sleep(1);
}

function generateUserData() {
  // Generate random user data
  let firstName = randomFirstName();
  let lastName = randomLastName();
  let email = generateRandomEmail(firstName, lastName);

  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    // Add more fields as needed
  };
}

function randomFirstName() {
  // Generate random first name
  let firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Emily', 'Michael'];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

function randomLastName() {
  // Generate random last name
  let lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Lee', 'Davis'];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

function generateRandomEmail(firstName, lastName) {
  // Generate random email
  let domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'example.com'];
  let randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomDomain}`;
}
