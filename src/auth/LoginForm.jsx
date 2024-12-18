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
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


/** Login form
 * 
 * Route is '/login'
 * 
 * - shows form
 * - updates the formData state when values in the input fields change
 * 
 * On submission:
 * - calls login function prop
 * - redirects to homepage ('/')
 */

function LoginForm({ login }) {
    /**Material UI's reveal/hide password related */
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => { event.preventDefault() };
    const handleMouseUpPassword = (event) => { event.preventDefault() };
    /**End Material UI's reveal/hide password related */

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
            setLoadingInfo(false);
        }
    }

    /**Update the formData state and show those changes in the input fields */
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
                            fontSize: { xs: '35px', lg: '36px', xl: '40px' },
                            textAlign: 'center',
                            mt: 5
                        }}>
                            Login Form
                        </Typography>
                    </Box>

                    <Box sx={{ width: '100%', mt: { xs: 2, sm: 3, xl: 2 }, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            label="Username"
                            sx={{ width: { xs: '75%', lg: '73%' } }}
                        />
                    </Box>

                    <Box sx={{ width: '100%', mt: { xs: 2, sm: 3, lg: 2 }, display: 'flex', justifyContent: 'center' }}>
                        <FormControl sx={{ m: 1, width: { xs: '75%', lg: '73%' } }} variant="outlined">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'hide password' : 'display password'}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
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
                            sx={{ width: { xs: '75%', lg: '73%' }, height: '54px', mt: { xs: 2, sm: 3, lg: 2 }, backgroundColor: '#cf8d86' }}
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
                            sx={{ py: 1, mt: { xs: 3.5, sm: 4.5, lg: 3.5 }, mb: { xs: 3.5, sm: 4.5 }, color: 'text.secondary' }}
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
