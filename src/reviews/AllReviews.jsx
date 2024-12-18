import TimedMessage from '../common/TimedMessage';
//Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';


/**AllReviews component
 * - render all of a book's reviews
 * - if there are no reviews, then render the no reviews message
 * - component using AllReviews: BookDetail
 */

function AllReviews({ allReviews, setShowAllReviews }) {
    if (!allReviews.length) {
        return (
            <div>
                <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TimedMessage setState={setShowAllReviews} type={'info'} message={'There are no reviews on this book'} />
                </Box>
            </div >
        )
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component='h2'
                    sx={{ fontSize: { lg: '21.7px' }, marginTop: '30px', marginLeft: '25px', textDecoration: 'underline' }}>
                    All Reviews:
                </Box>
                <IconButton onClick={() => (setShowAllReviews(false))} sx={{ mr: { xs: 1.36, lg: 2.2 } }} size="large" color='warning' aria-label="close">
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </Box>

            {allReviews.toReversed().map((review) => (
                <div key={review.id} >
                    <Box sx={{ mx: 3, mt: 1, mb: 4 }}>
                        <Typography sx={{ fontSize: { xs: 19, lg: 17 }, wordBreak: "break-word" }}>
                            {review.comment}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: 18, lg: 16.4 }, color: '#424242', mt: 2, mb: 1 }}>
                            {review.username} - {new Date(review.created_at).toLocaleDateString()}
                        </Box>

                        < Divider sx={{ mb: '30px' }} />
                    </Box>
                </div>
            ))}
        </div >
    )
};

export default AllReviews;
