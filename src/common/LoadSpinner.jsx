import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


/**Loading message used by components while API data is being fetched  */

function LoadSpinner() {
    return (
        <Box sx={{ width: '100%', height: { xs: '68vh', sm: '63vh', lg: '75vh' }, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '28px' }}>
                <i className="fa-solid fa-spinner fa-spin-pulse fa-lg"></i>
                <br />
                Loading
            </Typography>
        </Box>
    )
};

export default LoadSpinner;