interface CommonInputs {
  concept: {
    uuid: string;
  };
  status: 'FINAL' | string;
  display: 'Hematocrit' | string;
  order: {
    uuid: '05ddcdd5-f165-43e7-b970-b5cb14ebd137' | string;
  };
// ? value
  value: string & number;
// : or groupMembers
  groupMembers?: {
    concept: {
      uuid: '1015AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    };
    value: 12;
    status: 'FINAL';
    display: 'Hematocrit';
    order: {
      uuid: 'b97f3f0d-d335-4ffd-83db-23a49e4a9684';
    };
  }[];
}

interface LabResultInput {
  status: string;
  name: string;
  createdDate: Date;
  updatedDate: Date;
  result: CommonInputs[];
}

export interface CreateOrUpdatePatientInput {
  openmrsId: string;
  phone?: string;
  firstName: string;
  lastName: string;
  labResults?: LabResultInput[];
}
