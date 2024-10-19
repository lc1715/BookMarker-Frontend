import { Routes, Route } from 'react-router-dom';

import Homepage from '../homepage/Homepage';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import ProtectedRoute from './ProtectedRoute';
import ProfileForm from '../profile/ProfileForm';
import BookDetail from '../books/BookDetail';
import BookList from '../books/BookList';

/**Site-wide routes
 * 
 * Certain parts of website can only be visited if user is logged in.
 * Those routes are wrapped with <ProtectedRoute>, which is an authorization component.
 * 
 * Visiting a non-existant route redirects to the homepage.
 * 
 */

//Need to add non-existent route path
function RouteList({ signup, login }) {
    return (
        <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='login' element={<LoginForm login={login} />} />
            <Route path='signup' element={<SignupForm signup={signup} />} />
            <Route path='books/search/:term' element={<BookList />} />
            <Route path='books/:bookIdType/:bookId' element={<BookDetail />} />

            <Route path='profile' element={
                <ProtectedRoute>
                    <ProfileForm />
                </ProtectedRoute>
            } />

            <Route path='*' element={<Homepage />} />
        </Routes>
    )
};

export default RouteList;

