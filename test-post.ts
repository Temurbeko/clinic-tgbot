import { Patient } from '@prisma/client';

// test-post.js
const axios = require('axios');
const base = 'http://localhost:3000';

const createPatient = async () => {
  const response = await axios.post(`${base}/patients`, {
    openmrsId: '00001',
    phone: '+998776665544',
    testResults: {
      name: 'Ichoriqliqi: ichoriq',
    },
    firstName: 'Jonibek',
    lastName: 'Jonibekov',
  } as Partial<Patient>);
  console.log('Patient created: ', response.data);
};

createPatient();
