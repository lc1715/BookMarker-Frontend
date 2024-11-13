import { useState, useContext } from 'react';
import ShowAlert from "../common/ShowAlert";
import BookMarkerApi from "../api/api";
import UserContext from "../auth/UserContext";
//Material UI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';


function ReviewForm({ book, addBook, setReviewChange, setOpenReviewForm, setBookStatus, setScrollToReview }) {
    const [formData, setFormData] = useState({
        comment: ''
    });

    const [formErrors, setFormErrors] = useState([]);

    const { currentUser, hasSavedBook } = useContext(UserContext);

    //adds review to db. check if book has already been saved in saved books.
    //if not, then add review and add book to read books
    async function handleSubmit(evt) {
        evt.preventDefault();
        //if book has not been saved and user tries to write a review,
        //then automatically add book to Read status 
        if (!hasSavedBook(book.volumeId)) {
            await addBook(true);

            setBookStatus(true);
        }

        //add the review to db
        try {
            await BookMarkerApi.addReview(book.volumeId, currentUser.username, { ...formData });

            setReviewChange(true);
            setOpenReviewForm(false);
            setScrollToReview(true);
        } catch (err) {
            setFormErrors(err);
            return;
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
        <Container maxWidth="xl" sx={{ display: 'flex' }}>
            <form onSubmit={handleSubmit}>
                <FormControl
                    variant="outlined"
                    sx={{
                        width: { xs: 320, sm: 400, md: 555, lg: 575 },
                        height: 200,
                        mb: 2
                    }}>
                    <TextField
                        name='comment'
                        value={formData.comment}
                        label="Add Review"
                        onChange={handleChange}
                        rows={7}
                        multiline
                    />
                </FormControl>

                <Button variant="contained"
                    type='submit'
                    sx={{ fontSize: { lg: '13px' } }}
                >
                    Add Review
                </Button>

                <Button variant="contained"
                    size="medium"
                    sx={{ ml: 1, fontSize: { lg: '13px' } }}
                    type='button'
                    onClick={() => (setOpenReviewForm(false))}
                >
                    Cancel
                </Button>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {formErrors.length ? <ShowAlert type='error' messages={formErrors} /> : null}
                </Box>
            </form >
        </Container >
    )
};

export default ReviewForm;
