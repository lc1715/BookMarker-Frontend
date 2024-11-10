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


/** Login form
 * 
 * Route is '/login'
 * 
 * Shows form and manages the update to formData state 
 * when values in input fields change.
 * 
 * On submission:
 * - calls login function prop
 * - redirects to homepage ('/')
 */

function LoginForm({ login }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState(false);

    const navigate = useNavigate();

    /** Handles login form submission:
     * -Calls the login function in App.jsx which will get user token
     * -If login successful and token received, returns { success: true }, and navigates to homepage
     * -Otherwise returns { success: false, err }
     */
    async function handleSubmit(evt, data) {
        evt.preventDefault();
        setLoadingInfo(true);

        let result = await login(data);

        if (result.success) {
            navigate('/');
        } else {
            setFormErrors(result.err);
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
                mt: { xs: 7, md: 10 },
                mb: 4
            }}>
                <Paper elevation={4}
                    sx={{
                        width: '90%',
                        backgroundColor: '#FCFBF4'
                    }}
                >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Typography sx={{
                            fontSize: { xs: '35px', md: '47px' },
                            textAlign: 'center',
                            mt: 5
                        }}>
                            Login Form
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            label="Username"
                            sx={{ width: '75%' }}
                        />
                    </Box>

                    <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            label="Password"
                            sx={{ width: '75%' }}
                        />
                    </Box>

                    {formErrors.length ?
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShowAlert type='error' messages={formErrors} />
                        </Box>
                        :
                        null
                    }

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="medium"
                            sx={{ mt: 4, width: '75%', height: 54, backgroundColor: '#cf8d86' }}
                            onClick={(evt) => (handleSubmit(evt, formData))}
                            type='submit'
                        >
                            Submit
                        </Button>
                    </Box>

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="text"
                            size="medium"
                            sx={{ py: 1, mt: 4.5, mb: 4.5, color: 'text.secondary' }}
                            onClick={(evt) => (handleSubmit(evt, { username: 'TestUser', password: 'Password123' }))}
                            type='submit'
                        >
                            Demo User
                        </Button>
                    </Box>
                </Paper>
            </Container >
        </form >
    )
};

export default LoginForm;
