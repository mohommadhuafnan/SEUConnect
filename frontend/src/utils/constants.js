const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

export const UNIVERSITY_INFO = {
  name: 'South Eastern University of Sri Lanka',
  shortName: 'SEUSL',
  faculty: 'Faculty of Technology',
  location: 'Oluvil, Sri Lanka',
  departments: [
    'Department of Information and Communication Technology (DICT)',
    'Department of Bio-systems Technology (DBST)',
    'Department of Multidisciplinary Studies'
  ],
  bankAccount: {
    bank: "People's Bank",
    branch: 'Addalaichenai',
    accountNo: '228 1001 9000 1704'
  }
};

export const ROLES = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  ADMIN: 'admin'
};
