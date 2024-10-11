import './App.css'

import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import useLocalStorage from './hooks/useLocalStorage';
import BookMarkerApi from './api/api';
import UserContext from './auth/UserContext';
import LoadSpinner from './common/LoadSpinner';
import NavBar from './routes-nav/NavBar';
import RouteList from './routes-nav/RouteList';


// key-name for storing token in localStorage 
const TOKEN_STORAGE_ID = 'bookMarker-token'

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID)
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(() => {
    console.debug("App: useEffect to load current user info", "token=", token);

    async function getCurrentUserInfo() {
      if (token) {
        try {
          //get user's username from JWT token
          const payload = jwtDecode(token);
          const username = payload.username;
          //set token to BookMarkerApi for API call authorization
          BookMarkerApi.token = token
          //get data on the current user
          let currentUser = await BookMarkerApi.getCurrentUser(username);
          setCurrentUser(currentUser);
        } catch (err) {
          console.error('App: problem loading currentUser', err)
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUserInfo();
  }, [token]);


  /** Handles site-wide signup.
  *
  * Get token upon signup.
  */
  async function signup(signupData) {
    try {
      let token = await BookMarkerApi.signup(signupData);
      setToken(token);

      return { success: true };
    } catch (err) {
      console.error('sign up failed. errors:', err);
      return { success: false, err }
    }
  }

  /**Handles site-wide login */
  async function login(loginData) {
    try {
      let token = await BookMarkerApi.login(loginData);
      setToken(token);

      return { success: true };
    } catch (err) {
      console.error('login failed. errors:', err);
      return { success: false, err }
    }
  }

  /** Handles site-wide logout. */
  async function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  if (!infoLoaded) {
    return <LoadSpinner />;
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <div>
          <NavBar logout={logout} />
          <RouteList signup={signup} login={login} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
