const usePatient = {
  isLoading: false,
  patient: {
    resourceType: 'Patient',
    id: 'd1742029-0e4f-4f18-9b20-80faaa47acc5',
    meta: {
      versionId: '1740046122000',
      lastUpdated: '2025-02-20T10:08:42.000+00:00',
      tag: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
          code: 'SUBSETTED',
          display: 'Resource encoded in summary mode',
        },
      ],
    },
    identifier: [
      {
        id: '6bf4c49f-030a-4efe-a957-1efcf2dea45c',
        extension: [
          {
            url: 'http://fhir.openmrs.org/ext/patient/identifier#location',
            valueReference: {
              reference: 'Location/44c3efb0-2583-4c80-a79e-1f756a03c0a1',
              type: 'Location',
              display: 'Outpatient Clinic',
            },
          },
        ],
        use: 'official',
        type: {
          coding: [
            {
              code: '05a29f94-c0ed-11e2-94be-8c13b969e334',
            },
          ],
          text: 'OpenMRS ID',
        },
        value: '100063J',
      },
    ],
    active: true,
    name: [
      {
        id: '3ce24c37-be50-46ca-aabc-cbc4b69772e6',
        text: 'Begi Rajapboyev Xikmatullayevich',
        family: 'Xikmatullayevich',
        given: ['Begi', 'Rajapboyev'],
      },
    ],
    telecom: [
      {
        id: '5418e648-c096-436e-8327-20b464a68de2',
        value: '+998996837609',
      },
    ],
    gender: 'male',
    birthDate: '2002-02-07',
    deceasedBoolean: false,
  },
  patientUuid: 'd1742029-0e4f-4f18-9b20-80faaa47acc5',
};
