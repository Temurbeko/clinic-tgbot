import { Patient } from '@prisma/client';

// test-post.js
const axios = require('axios');
const base = process.env.BASE_URL || 'http://localhost:3000';

const createPatient = async () => {
  try {
    const response = await axios.post(`${base}/patients`, {
      firstName: 'Temurbek',
      lastName: 'Rajapboyev',
      openmrsId: '10006A3',
      phone: '998996551401',
      labResults: [
        {
          name: 'Casts presence in urine sediment by light microscopy test',
          createdDate: '2025-02-21T13:40:17.698Z',
          updatedDate: '2025-02-21T13:40:17.698Z',
          status: 'Bormi ogliq',
          result:
            '{"163696AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA":"163690AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}',
        },
      ],
    } as Partial<Patient>);
    console.log('Patient created: ', response.data);
  } catch (error) {
    console.error(
      'Error creating patient:',
      error.response ? error.response.data : error.message,
    );
  }
};
const getAllPatients = async () => {
  try {
    const response = await axios.get(`${base}/patients`);
    console.log('Patient created: ', response.data);
  } catch (error) {
    console.error(
      'Error creating patient:',
      error.response ? error.response.data : error.message,
    );
  }
};

// createPatient();
getAllPatients()
