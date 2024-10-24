import { useState, useContext } from 'react';
import UserContext from '../auth/UserContext';
import BookMarkerApi from "../api/api";
import EditReviewForm from './EditReviewForm';


//shows review. has option to edit or delete review
function Review({ userReview, setReviewChange }) {
    const [showEditReviewForm, setShowEditReviewForm] = useState(false);

    const { currentUser } = useContext(UserContext);


    async function editReview() {
        setShowEditReviewForm(true);
    };

    async function deleteReview() {
        try {
            await BookMarkerApi.deleteReview(userReview.id, currentUser.username);

            setReviewChange(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <p>My Review</p>
            <p>{userReview.comment}</p>

            <button onClick={editReview}>Edit</button>

            <button onClick={deleteReview}>Delete</button>

            {showEditReviewForm
                ?
                <EditReviewForm userReview={userReview} setReviewChange={setReviewChange} setShowEditReviewForm={setShowEditReviewForm} />
                :
                null
            }
        </div>
    );
};

export default Review;
