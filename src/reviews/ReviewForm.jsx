import { useState, useContext } from 'react';
import ShowAlert from "../common/ShowAlert";
import BookMarkerApi from "../api/api";
import UserContext from "../auth/UserContext";


function ReviewForm({ book, addBook, setReviewChange, setShowReviewForm }) {
    const [formData, setFormData] = useState({
        comment: ''
    });

    const [formErrors, setFormErrors] = useState([]);

    const { currentUser, hasSavedBook, saveBooks } = useContext(UserContext);


    //handleSubmit: adds review to db. check if book has already been saved in saved books.
    //if not, then add review and add book to read books
    async function handleSubmit(evt) {
        evt.preventDefault();
        //if book has not been saved and user tries to write a review,
        //then automatically add book to Read status 
        if (!hasSavedBook(book.volumeId)) {
            try {
                await addBook(true);
            } catch (err) {
                console.log(err);
            }
        }

        //add the review to db
        try {
            await BookMarkerApi.addReview(book.volumeId, currentUser.username, { ...formData });

            setReviewChange(true);

            setShowReviewForm(false);
        } catch (err) {
            console.log(err);
        }
    };

    /**Handles changes in form data */
    function handleChange(evt) {
        const { name, value } = evt.target;

        setFormData((data) => ({
            ...data, [name]: value
        }));
    };


    return (
        <form onSubmit={handleSubmit}>

            <label htmlFor="comment">Review</label>
            <input
                id='comment'
                name='comment'
                value={formData.comment}
                onChange={handleChange}
            />

            {formErrors.length ? <ShowAlert type='danger' messages={formErrors} /> : null}

            <button>Add Review</button>

            <button type='button' onClick={() => (setShowReviewForm(false))}>Cancel</button>
        </form>
    )
};

export default ReviewForm;