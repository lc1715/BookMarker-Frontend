import { useContext } from 'react';
import UserContext from '../auth/UserContext';


function Rating({ rating, setRating, addRating, updateRating, hover, setHover }) {
    console.log('rating=', rating)

    const { currentUser } = useContext(UserContext);


    /* click on star, update rating if rating already exists otherwise add new rating*/
    async function submitRating(star) {
        console.log('star=', star)

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
                {
                    [1, 2, 3, 4, 5].map((star) => {
                        return (
                            <span
                                style={{
                                    color: star <= (hover || rating) ? '#e87400' : 'gray',
                                    cursor: 'pointer',
                                    fontSize: '39px'
                                }}
                                onClick={() => (submitRating(star))}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                                key={star}
                            >
                                {' '}★{' '}
                            </span>
                        )
                    })
                }
            </div>
        )
    };

    function loggedOutRating() {
        return (
            <div>
                {
                    [1, 2, 3, 4, 5].map((star) => {
                        return (
                            <span
                                style={{
                                    color: 'gray',
                                    cursor: 'pointer',
                                    fontSize: '39px'
                                }}
                                onClick={() => (submitRating(star))}
                                key={star}
                            >
                                {' '}★{' '}
                            </span>
                        )
                    })
                }
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