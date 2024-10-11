import { useContext } from 'react';
import UserContext from '../auth/UserContext';
import { Link } from 'react-router-dom';


/** Navigation bar for site. 
 * Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. 
 * When not logged in, shows link to Login and Signup forms.
 *
 * Rendered by App.jsx
 */

function NavBar({ logout }) {
    let { currentUser } = useContext(UserContext);

    if (currentUser) {
        return (
            <div>
                <Link to='/'>BookMarker</Link>
                <Link to='/profile'>Profile</Link>
                <Link to='/' onClick={logout} >Log Out {currentUser.username}</Link>
            </div>
        )
    }

    return (
        <div>
            <Link to='/'>BookMarker</Link>
            <Link to='/login'>Log In</Link>
            <Link to='/signup'>Sign Up</Link>
        </div>
    )
};

export default NavBar;
// <Link to={`/savedbooks/read/user/${currentUser.username}`}>Read</Link>
// <Link to={`/savedbooks/wish/user/${currentUser.username}`}>Wish To Read</Link>