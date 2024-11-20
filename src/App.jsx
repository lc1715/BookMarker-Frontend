import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useLocalStorage from './hooks/useLocalStorage';
import BookMarkerApi from './api/api';
import UserContext from './auth/UserContext';
import LoadSpinner from './common/LoadSpinner';
import NavBar from './routes-nav/NavBar';
import RouteList from './routes-nav/RouteList';

//key name for storing token in localStorage
const TOKEN_STORAGE_ID = 'bookMarker-token';

/** BookMarker application.
 *
 * - infoLoaded: has user data been pulled from API?
 *   (this manages spinner for "loading...")
 *
 * - currentUser: user object from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Token is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> Routes
 */

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [savedBooks, setSavedBooks] = useState(new Set([]));

  /** useEffect will run when the token changes (user logs in, signs up or logs out)
   * - store the token in BookMarkerApi
   * - decode token to get username and make API call to get the current user data
   * - set current user data into the currentUser state
   * - set current user's saved books into savedBooks state as a Set
   */
  useEffect(() => {
    async function getCurrentUserInfo() {
      if (token) {
        try {
          // get username from token payload
          const payload = jwtDecode(token);
          const username = payload.username;
          // set token in BookMarkerApi to authorize API calls
          BookMarkerApi.token = token
          // get current user data
          let currentUser = await BookMarkerApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setSavedBooks(new Set(currentUser.volume_ids));
        } catch (err) {
          console.error('App: problem loading currentUser', 'err:', err)
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    // end of async func to call backend

    setInfoLoaded(false);
    getCurrentUserInfo();
  }, [token]);


  /** Handles site-wide signup
  * - get token upon signup
  * - change of token will trigger the useEffect which will get the currentUser info
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

  /** Handles site-wide login 
   * - get token upon login
   * - change of token will trigger the useEffect which will get the currentUser info
  */
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

  /** Handles site-wide logout */
  async function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** Check savedBooks state to see if volume id is already in the Set of saved books */
  function hasSavedBook(volumeId) {
    return savedBooks.has(volumeId);
  }

  /** Handles adding a book to user's saved books 
   * - make API call to add book in backend database
   * - update savedBooks state (Set) */
  async function saveBook(volumeId, data) {
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

  /** Handles removing a book in user's saved books 
  * - make API call to delete book in backend database
  * - update savedBooks state (Set) */
  async function deleteSavedBook(volumeId, username) {
    try {
      let res = await BookMarkerApi.deleteSavedBook(volumeId, username);
      //remove volume id in savedBooks state 
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
