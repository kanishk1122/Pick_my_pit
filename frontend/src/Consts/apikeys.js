const baseurl = "http://localhost:5000/api/";
const USERPath = "users/";
const Authpath = "auth/";

const USER = {
  Login: baseurl + USERPath + "login/",
  Register: baseurl + USERPath,
  GetUser: baseurl + USERPath + "getuser/",
  EmailConfrimgenraterZXcv: baseurl + USERPath + "confirmationgenrate/",
  EmailConfrim: baseurl + USERPath + "confirmation/",
  Auth: baseurl + Authpath + "google-auth",
  Update: baseurl + USERPath + "update",
  FetchUser: baseurl + USERPath + "fetch-user",
};

export { USER };

export const ADDRESS = {
  Add: `${baseurl}address/add`,
  Get: (userId) => `${baseurl}address/${userId}`,
  Update: (addressId) => `${baseurl}address/update/${addressId}`,
  Delete: (addressId) => `${baseurl}address/delete/${addressId}`,
};

export const POST = {
  Create: `${baseurl}post/create`,
  GetAll: `${baseurl}post/all`,
  GetOne: (id) => `${baseurl}post/${id}`,
  Update: (id) => `${baseurl}post/update/${id}`,
  Delete: (id) => `${baseurl}post/delete/${id}`,
  GetUserPosts: `${baseurl}post/user`,
  Filter: `${baseurl}post/filter`,
  GetFree: `${baseurl}post/free`,
  GetPaid: `${baseurl}post/paid`,
  Breeds: `${baseurl}post/breeds`,
  GetSpecies: `${baseurl}species`,
  GetBreeds: `${baseurl}breeds`,
};
