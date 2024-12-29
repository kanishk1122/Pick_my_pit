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

    
}

export  { USER };