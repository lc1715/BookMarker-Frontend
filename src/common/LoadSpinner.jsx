import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


/**Loading message used by components while API data is being fetched  */

function LoadSpinner() {
    return (
        <Box sx={{ width: '100%', height: { xs: '63vh', lg: '75vh' }, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {/* <Box sx={{ width: '100%', height: '75vh' }}> */}
            <Typography sx={{ color: 'text.secondary', fontSize: '28px' }}>
                <i class="fa-solid fa-spinner fa-spin-pulse fa-lg"></i>
                <br />
                Loading
            </Typography>
        </Box>
    )
};

export default LoadSpinner;