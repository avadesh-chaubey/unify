import axios from 'axios';

const BuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      // baseURL: 'http://ingress-nginx-controller',
      baseURL: 'https://unify.care',
      headers: req.headers
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/'
    });
  }
};

export default BuildClient;
