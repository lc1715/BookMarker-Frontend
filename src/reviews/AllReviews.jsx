import TimedMessage from '../common/TimedMessage';
//Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';


//show all reviews on a book
function AllReviews({ allReviews, setShowAllReviews }) {
    if (!allReviews.length) {
        return (
            <div>
                <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TimedMessage setTimedMessage={setShowAllReviews} type={'info'} message={'There are no reviews on this book'} />
                </Box>
            </div >
        )
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginTop: '30px', marginLeft: '25px', textDecoration: 'underline', }}>
                    All Reviews:
                </h2>

                <IconButton onClick={() => (setShowAllReviews(false))} sx={{ mr: { xs: 1, lg: 2 } }} size="large" color='warning' aria-label="close all reviews">
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </Box>

            {
                allReviews.toReversed().map((review) => (
                    <div key={review.id} >
                        <Box sx={{ mx: 3, mt: 1, mb: 4 }}>
                            <Typography sx={{ fontSize: 19, wordBreak: "break-word" }}>{review.comment}</Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', color: '#5A5A5A', mt: 2, mb: 1 }}>
                                {review.username} - {new Date(review.created_at).toLocaleDateString()}
                            </Box>

                            < Divider sx={{ mb: '30px' }} />
                        </Box>
                    </div>
                ))
            }
        </div >
    )
};

export default AllReviews;
