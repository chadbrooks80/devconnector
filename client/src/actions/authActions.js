import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types'
import setAuthToken from '../utils/setAuthToken';
import jwtDecode from 'jwt-decode';

// Register User
export const registerUser = (userData, history) => dispatch => {

  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// login get user Token
export const loginUser = (userData) => dispatch => {
  alert("can it work?")
  axios.post('/api/users/login', userData)
    .then(res => {
      alert("in bitch!")
      // save to local storage
      const { token } = res.data;
      // set token to localstorage
      localStorage.setItem('jwtToken', token);
      // set token to auth header
      setAuthToken(token);
      // decode token to get user data
      const decodedToken = jwtDecode(token);
      // set current user
      dispatch(setCurrentUser(decodedToken));
    })
    .catch(err => {
      alert("fucked it!s")
      console.log(err.response.data)
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
}

// set loggedIn User
export const setCurrentUser = decodedToken => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedToken
  }
}

// log user out
export const logoutUser = () => dispatch => {
  // remove token from localStorage
  localStorage.removeItem('jwtToken');
  // remove the auth header for future requests
  // it will check if token and then remove it. 
  setAuthToken(false);
  // set current user to empty object {} which will isAuthenticated to false
  dispatch(setCurrentUser({}))
}