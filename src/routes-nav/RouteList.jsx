import { Routes, Route } from 'react-router-dom';

import Homepage from '../homepage/Homepage';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import ProtectedRoute from './ProtectedRoute';
import ProfileForm from '../profile/ProfileForm';
import BookDetail from '../books/BookDetail';
import BookList from '../books/BookList';
import ReadBooks from '../books/ReadBooks';
import WishToReadBook from '../books/WishToReadBook';

/**Site-wide routes
 * 
 * Certain parts of website can only be visited if user is logged in.
 * Those routes are wrapped with <ProtectedRoute>, which is an authorization component.
 * 
 * Visiting a non-existant route redirects to the homepage.
 * 
 */

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

            <Route path='books/read' element={
                <ProtectedRoute>
                    <ReadBooks />
                </ProtectedRoute>
            } />

            <Route path='books/wish' element={
                <ProtectedRoute>
                    <WishToReadBook />
                </ProtectedRoute>
            } />

            <Route path='*' element={<Homepage />} />
        </Routes>
    )
};

export default RouteList;
