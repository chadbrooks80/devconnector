import axios from 'axios';

export default (token) => {
  if (token) {
    // apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete Auth Header
    delete axios.defaults.headers.common['Authorization'];
  }
}