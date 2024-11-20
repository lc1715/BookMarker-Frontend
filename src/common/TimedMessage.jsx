import { useState } from 'react';
import Alert from '@mui/material/Alert';

/** Message shown to user for a limited amount of time. 
 *- If user is not logged in and tries to save a book, write a review 
 *  or rate a book, timed message will show. 
 *- If there are no reviews on a book and user clicks on All Reviews button, 
 *  timed message will show.
 *
 * Message will disappear after 6 seconds
 * 
 * Component using TimedMessage: BookDetail and AllReviews
 **/

function TimedMessage({ setState, type = 'error', message = 'Please login or signup to access this feature' }) {
    let [active, setActive] = useState(true);

    setTimeout(() => {
        setActive(false);
        setState(false);
    }, 6000)

    if (active) {
        return (
            <Alert severity={type} sx={{ mt: 2, fontSize: '17px' }}>
                {message}
            </Alert>
        )
    };
};

export default TimedMessage;
