const developmentApiUrl = 'http://localhost:5000';
const productionApiUrl = 'https://weacademia-exp-deploytest.herokuapp.com';

const apiUrl = process.env.NODE_ENV === 'development' ? developmentApiUrl : productionApiUrl;
// const apiUrl = productionApiUrl;

export {
  apiUrl
};
