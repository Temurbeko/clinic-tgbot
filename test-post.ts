import { Patient } from '@prisma/client';

// test-post.js
const axios = require('axios');
const base = process.env.BASE_URL || 'http://localhost:3000';

const createPatient = async () => {
  try {
    const response = await axios.post(`${base}/api/patients`, {
      openmrsId: '00001',
      phone: '+998776665544',
      testResults: {
        name: 'Ichoriqliqi: ichoriq',
      },
      firstName: 'Jonibek',
      lastName: 'Jonibekov',
    } as Partial<Patient>);
    console.log('Patient created: ', response.data);
  } catch (error) {
    console.error(
      'Error creating patient:',
      error.response ? error.response.data : error.message,
    );
  }
};

createPatient();
