import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../auth/UserContext';


function ProtectedRoute({ children }) {
    const { currentUser } = useContext(UserContext);

    if (!currentUser) {
        return <Navigate to='/' />
    };

    return children;
};

export default ProtectedRoute;