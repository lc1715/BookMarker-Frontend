import { useContext } from 'react';
import UserContext from '../auth/UserContext';
import Box from '@mui/material/Box';


/**Rating component
 * - shows star ratings
 * - if user is logged in, user can click on star which will add rating or update rating
 * - if there is no logged in user, only gray stars will be shown
 * - component using Rating: BookDetail
 */

function Rating({ rating, setRating, addRating, updateRating, hover, setHover }) {
    const { currentUser } = useContext(UserContext);

    async function submitRating(star) {
        if (!rating) {
            await addRating(star);
        } else {
            await updateRating(star)
        }

        setRating(star);
    };

    function loggedInRating() {
        return (
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Box component="span"
                        sx={{
                            color: star <= (hover || rating) ? '#e87400' : 'gray',
                            cursor: 'pointer',
                            fontSize: '38px'
                        }}
                        onClick={() => submitRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        key={star}
                    >
                        {' '}★{' '}
                    </Box>
                ))}
            </div>
        )
    };

    function loggedOutRating() {
        return (
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Box component="span"
                        sx={{
                            color: 'gray',
                            cursor: 'pointer',
                            fontSize: '38px'
                        }}
                        onClick={() => submitRating(star)}
                        key={star}
                    >
                        {' '}★{' '}
                    </Box>
                ))}
            </div>
        )
    };

    return (
        <>
            {currentUser ? loggedInRating() : loggedOutRating()}
        </>
    )
};

export default Rating;

