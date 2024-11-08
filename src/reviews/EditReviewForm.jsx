import { useState, useContext } from "react";
import BookMarkerApi from "../api/api";
import UserContext from "../auth/UserContext";
import ShowAlert from "../common/ShowAlert";
//Material UI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


function EditReviewForm({ userReview, setReviewChange, setEditReviewForm }) {
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

            setEditReviewForm(false);
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
        <Container maxWidth="xl" sx={{ display: 'flex' }}>
            <form onSubmit={handleSubmit}>
                <FormControl
                    variant="outlined"
                    sx={{
                        width: { xs: 320, sm: 400, md: 555, lg: 575 },
                        height: 200,
                        mb: 2
                    }}
                >
                    <TextField
                        name='comment'
                        value={formData.comment}
                        label="Edit Review"
                        onChange={handleChange}
                        rows={7}
                        multiline
                    />
                </FormControl>
                <Button
                    variant="contained"
                    size="medium"
                    type="submit"
                >
                    Change Review
                </Button>

                <Button
                    variant="contained"
                    size="medium"
                    sx={{ ml: 1 }}
                    type='button'
                    onClick={() => (setEditReviewForm(false))}
                >
                    Cancel
                </Button>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {formErrors.length ? <ShowAlert type='error' messages={formErrors} /> : null}
                </Box>
            </form >
        </Container>
    )
};

export default EditReviewForm;
