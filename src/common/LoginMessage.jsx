import { useState } from 'react';

/** If user is not logged in and tries to save a book, write a review 
 * or rate a book, show login message
 *
 * Message will disappear after 4 seconds
 * 
 * Component using LoginMessage: BookDetail
 **/

function LoginMessage({ setError }) {
    let [active, setActive] = useState(true);

    setTimeout(() => {
        setActive(false);
        setError(false);
    }, 4000)

    if (active) {
        return (
            <div>
                <p>Please login or signup to access this feature</p>
            </div>
        )
    };
};

export default LoginMessage;