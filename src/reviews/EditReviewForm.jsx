import { useState, useContext } from "react";
import BookMarkerApi from "../api/api";
import UserContext from "../auth/UserContext";
import ShowAlert from "../common/ShowAlert";


function EditReviewForm({ userReview, setReviewChange, setShowEditReviewForm }) {
    const [formData, setFormData] = useState({
        comment: userReview.comment
    });

    const [formErrors, setFormErrors] = useState([]);

    const { currentUser } = useContext(UserContext);

    //update review
    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            const newReview = await BookMarkerApi.updateReview(userReview.id, currentUser.username, { ...formData });
            console.log('newReview=', newReview)

            setReviewChange(true);

            setShowEditReviewForm(false);
        } catch (err) {
            setFormErrors(err);
            return;
        }
    }

    /**Handles changes in form data */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    return (
        <form onSubmit={handleSubmit}>

            <textArea
                name='comment'
                value={formData.comment}
                onChange={handleChange}
            />

            <button>Change Review</button>
            <button type='button' onClick={() => (setShowEditReviewForm(false))}>Cancel</button>
            {/* close modal/close the edit review form comp */}

            {formErrors.length ? <ShowAlert type='danger' messages={formErrors} /> : null}
        </form>
    )
};

export default EditReviewForm;