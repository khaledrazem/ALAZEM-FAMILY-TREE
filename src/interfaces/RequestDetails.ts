export interface RequestDetails {
  data: {
    avatar: string;
    firstName: string;
    lastName: string;
    birthday: string;
    gender: 'M' | 'F';
    maritalStatus: 'Married' | 'Single';
    emailAddress: string;
    publicEmail: boolean;
    gallaryPhotos: string[];
    identityDocument?: string;
    spouse?: UserReference;
    father?: UserReference;
    mother?: UserReference;
    siblings?: UserReference[];
    children?: UserReference[];
  };
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface UserReference {
  id: string;
  data: {
    firstName: string;
    lastName: string;
    birthday: number | string;
  };
}