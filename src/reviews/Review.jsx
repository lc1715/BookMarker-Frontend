import { useState, useContext } from 'react';
import UserContext from '../auth/UserContext';
import BookMarkerApi from "../api/api";
import EditReviewForm from './EditReviewForm';
//Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';


//shows review. has option to edit or delete review
function Review({ userReview, setReviewChange, setRanFirstScroll, setScrollToReview }) {
    console.log('userReview=', userReview)
    const [editReviewForm, setEditReviewForm] = useState(false);
    const { currentUser } = useContext(UserContext);


    async function openEditReviewForm() {
        setEditReviewForm(true);
    };

    function closeEditReviewForm() {
        setEditReviewForm(false);
    }

    async function deleteReview() {
        try {
            await BookMarkerApi.deleteReview(userReview.id, currentUser.username);

            setReviewChange(true);
            setScrollToReview(false);
            setRanFirstScroll(false);
        } catch (err) {
            console.log(err);
        }
    };

    //styles the modal for edit review form
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 620,
        backgroundColor: '#fff',
        border: '1px solid #000',
        boxShadow: 24,
        py: 3
    };

    return (
        <div>
            <Box sx={{ ml: 3, mr: { xs: 2, lg: 3 } }}>
                <h2 style={{ marginTop: '30px', marginBottom: '30px', textDecoration: 'underline' }}>
                    My Review:
                </h2>

                <Typography sx={{ fontSize: 19, wordBreak: "break-word" }}>{userReview.comment}</Typography>

                <Box sx={{ mb: 1, mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
                        {userReview.username} - {new Date(userReview.created_at).toLocaleDateString()}
                    </p>

                    <Box sx={{ display: 'flex' }}>
                        <IconButton onClick={openEditReviewForm} color='success' aria-label="edit review"  >
                            <EditIcon sx={{ fontSize: { xs: 28, md: 30 } }} />
                        </IconButton>
                        <IconButton onClick={deleteReview} sx={{ pr: .4 }} color='secondary' aria-label="delete review">
                            <DeleteIcon sx={{ fontSize: { xs: 28, md: 30 } }} />
                        </IconButton>
                    </Box>
                </Box>

                <Modal
                    open={editReviewForm}
                    onClose={closeEditReviewForm}
                    aria-labelledby="modal-modal-reviewForm"
                    aria-describedby="modal-modal-reviewForm"
                >
                    <Box sx={{ ...style, width: { xs: 348, sm: 446, md: 600, lg: 620 } }}>
                        <EditReviewForm userReview={userReview} setReviewChange={setReviewChange} setEditReviewForm={setEditReviewForm} />
                    </Box>
                </Modal>
            </Box>

            <Divider sx={{ borderWidth: 1, mb: 1 }} />
        </div >
    );
};

export default Review;
