import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowAlert from '../common/ShowAlert';
import LoadSpinner from '../common/LoadSpinner';
//Material UI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


/** Signup form
 *
 * Route is '/signup'
 * 
 * Shows form and manages the update to formData state 
 * when values in input fields change.
 * 
 * On submission:
 * - calls the signup function prop 
 * - redirects to homepage ('/')
 */

function SignupForm({ signup }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [formErrors, setFormErrors] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const navigate = useNavigate();

    /** Handles signup form submission:
     * -Calls the signup function in App.jsx which will get user token
     * -If signup successful and token received, returns { success: true }, and navigates to homepage
     * -Otherwise returns { success: false, err }
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        setLoadingInfo(true);
        let result = await signup(formData);
        console.log('result=', result)
        if (result.success) {
            navigate('/');
        } else {
            setFormErrors(result.err);
            setLoadingInfo(false);
        }
    }

    /**Update the formData state and render those changes in the input fields */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    if (loadingInfo) {
        return <LoadSpinner />
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
                        width: { xs: '90%', lg: '85%' },
                        backgroundColor: '#FCFBF4'
                    }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Typography sx={{
                            fontSize: { xs: '35px', lg: '40px' },
                            textAlign: 'center',
                            mt: 5
                        }}>
                            Signup Form
                        </Typography>
                    </Box>

                    <Box sx={{ width: '100%', mt: { xs: 4, lg: 2.5 }, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            label="Username"
                            sx={{ width: { xs: '75%', lg: '73%' } }}
                        />
                    </Box>

                    <Box sx={{ width: '100%', mt: { xs: 3, lg: 2.5 }, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            label="Password"
                            sx={{ width: { xs: '75%', lg: '73%' } }}
                        />
                    </Box>

                    <Box sx={{ width: '100%', mt: { xs: 3, lg: 2.5 }, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            label="Email"
                            sx={{ width: { xs: '75%', lg: '73%' } }}
                        />
                    </Box>

                    {formErrors.length ?
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShowAlert type='error' messages={formErrors} />
                        </Box>
                        :
                        null}

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="medium"
                            sx={{ width: { xs: '75%', lg: '73%' }, height: 54, mt: { xs: 3, lg: 2.5 }, mb: { xs: 6.5, sm: 7.9, lg: 8 }, backgroundColor: '#cf8d86' }}
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

export default SignupForm;
