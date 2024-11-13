import Alert from '@mui/material/Alert';

/** Component for showing alert messages.
 *
 * Components using this: LoginForm, SignupForm, ProfileForm, BookList, AllReviews, EditReview, ReviewForm
 **/

function ShowAlert({ type = 'error', messages = [] }) {
    console.debug('ShowAlert:', 'type:', type, 'messages:', messages);

    return (
        <div>
            {messages.map((message) => (
                <Alert severity={type} sx={{ mx: 'auto', fontSize: { xs: '17px', lg: '16px' } }} key={message}>
                    {message}
                </Alert>
            ))
            }
        </div >
    )
};

export default ShowAlert;
