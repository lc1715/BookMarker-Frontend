import { useState, useContext } from 'react';
import BookMarkerApi from '../api/api';
import UserContext from '../auth/UserContext';
import ShowAlert from '../common/ShowAlert';
//Material UI
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


/** Edit profile form
 *
 * - Displays profile form
 * - Submitting the form calls the BookMarkerApi to update user profile
 * - If successful, triggers current user to be reloaded throughout the site and
 *  shows successful alert message
 * 
 * Route: /profile
 */

function ProfileForm() {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        username: currentUser.username,
        email: currentUser.email
    });
    const [formErrors, setFormErrors] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    /** On form submit:
     * - attempt to save new user info to backend & report any errors
     * - if successful
     *   - clear previous error messages
     *   - show successful alert message
     *   - set new current user info throughout the site
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        let username = formData.username;
        let newEmail = formData.email;
        let updatedUser;
        try {
            updatedUser = await BookMarkerApi.updateUserProfile(username, { email: newEmail });
        } catch (err) {
            setFormErrors(err);
            return;
        }

        setFormErrors([]);
        setIsSaved(true);
        // trigger reloading of current user information throughout the site
        setCurrentUser(updatedUser);

        setTimeout(() => {
            setIsSaved(false)
        }, 4000)
    };

    /** Handle form data changing*/
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
        setFormErrors([]);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Container maxWidth="sm" sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: { xs: 7, lg: 10 },
                mb: 4
            }}>
                <Paper elevation={4}
                    sx={{
                        width: { xs: '90%', lg: '86%' },
                        backgroundColor: '#FCFBF4'
                    }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Typography sx={{
                            fontSize: { xs: '35px', lg: '40px' },
                            textAlign: 'center',
                            mt: 4
                        }}>
                            User Profile
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            label="Username"
                            disabled={true}
                            sx={{ width: { xs: '75%', lg: '73%' } }}
                        />
                    </Box>

                    <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            label="Email"
                            sx={{ width: { xs: '75%', lg: '73%' } }}
                            type='email'
                        />
                    </Box>

                    {formErrors.length ?
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShowAlert type='error' messages={formErrors} />
                        </Box>
                        :
                        null}

                    {isSaved ?
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShowAlert type='success' messages={['Updated successfully']} />
                        </Box>
                        :
                        null}

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="medium"
                            sx={{ mt: 4, mb: 8, width: { xs: '75%', lg: '73%' }, height: 54, backgroundColor: '#cf8d86' }}
                            onClick={handleSubmit}
                            type='submit'
                        >
                            Submit
                        </Button>
                    </Box>
                </Paper>
            </Container >
        </form >
    )
};

export default ProfileForm;
