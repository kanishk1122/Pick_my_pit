const baseurl = 'http://localhost:3000/api/';
const USERPath = 'users/';
const Authpath = 'auth/'


const USER ={

    Login: baseurl + USERPath + 'login/',
    Register: baseurl + USERPath ,
    GetUser : baseurl + USERPath + 'getuser/',
    EmailConfrimgenraterZXcv  : baseurl + USERPath + 'confirmationgenrate/',
    EmailConfrim : baseurl + USERPath + 'confirmation/',
    Auth : baseurl + Authpath + 'google-auth',
    Update : baseurl + USERPath + 'update/',
    FetchUser: baseurl + USERPath + 'fetch-user',


    
}

export  { USER };

export const ADDRESS = {
  Add: `${baseurl}address/add`,
  Get: (userId) => `${baseurl}address/${userId}`,
  Update: (addressId) => `${baseurl}address/update/${addressId}`,
  Delete: (addressId) => `${baseurl}address/delete/${addressId}`
};