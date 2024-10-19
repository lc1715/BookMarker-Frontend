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


const TOKEN_STORAGE_ID = 'bookMarker-token';

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [savedBooks, setSavedBooks] = useState(new Set([]));
  console.log('savedBooks=', savedBooks)

  useEffect(() => {
    console.debug('App: useEffect to load current user info', 'token=', token);

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
          console.log('currentUser =', currentUser)
          setCurrentUser(currentUser);

          setSavedBooks(new Set(currentUser.volume_ids));
        } catch (err) {
          console.error('App: problem loading currentUser', 'err:', err)
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
      console.error('sign up failed:', err);
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

  /**Check state, savedBooks, to see if volume id is already in the Set of saved books */
  function hasSavedBook(volumeId) {
    return savedBooks.has(volumeId);
  }

  //add a book to saved books and update state
  async function saveBook(volumeId, data) {
    console.log('data=', data, 'volumeId=', volumeId)

    if (hasSavedBook(volumeId)) return;
    try {
      let savedBook = await BookMarkerApi.addSavedBooks(
        volumeId,
        currentUser.username,
        data);

      setSavedBooks(new Set([...savedBooks, volumeId]));

      return savedBook;
    } catch (err) {
      console.log(err);
    };
  };

  //delete saved book in db:
  async function deleteSavedBook(volumeId, username) {
    try {
      let res = await BookMarkerApi.deleteSavedBook(volumeId, username);

      //remove volumeId in savedBooks
      setSavedBooks((set) => {
        set.delete(res.volume_id);
        return new Set([...set]);
      });

      return res;
    } catch (err) {
      console.log(err);
    }
  }

  if (!infoLoaded) {
    return <LoadSpinner />;
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser, hasSavedBook, saveBook, deleteSavedBook }}>
        <div>
          <NavBar logout={logout} />
          <RouteList signup={signup} login={login} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
