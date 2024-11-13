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
                <Box component='h2'
                    sx={{ fontSize: { lg: '21.7px' }, marginTop: '30px', marginBottom: '30px', textDecoration: 'underline' }}>
                    My Review:
                </Box>

                <Typography sx={{ fontSize: { xs: 19, lg: 17 }, wordBreak: "break-word" }}>
                    {userReview.comment}
                </Typography>

                <Box sx={{ mb: 1, mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box component='p'
                        sx={{ fontSize: { xs: 18, lg: 16.4 }, color: '#424242' }}>
                        {userReview.username} - {new Date(userReview.created_at).toLocaleDateString()}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={openEditReviewForm} color='success' aria-label="edit review"  >
                            <EditIcon sx={{ fontSize: { xs: 28, lg: 27.4 } }} />
                        </IconButton>
                        <IconButton onClick={deleteReview} sx={{ xs: { pr: .4 } }} color='secondary' aria-label="delete review">
                            <DeleteIcon sx={{ fontSize: { xs: 28, lg: 27.4 } }} />
                        </IconButton>
                    </Box>
                </Box>

                <Modal
                    open={editReviewForm}
                    onClose={closeEditReviewForm}
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
