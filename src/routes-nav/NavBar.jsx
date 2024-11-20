import { useState, useContext } from 'react';
import UserContext from '../auth/UserContext';
//Material UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import '@fontsource/roboto/400.css';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


/** Navigation bar for site. 
 * Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. 
 * When not logged in, shows link to Login and Signup forms.
 *
 * Rendered by App.jsx
 */

function NavBar({ logout }) {
    let { currentUser } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    //useMediaQuery hook
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const handleOpenMenu = (evt) => {
        setAnchorEl(evt.currentTarget);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        logout();
        setAnchorEl(null);
    }

    function loggedInNav() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{
                    backgroundColor: '#748cab',
                    boxShadow: 'none'
                }}>
                    <Toolbar sx={{ flexWrap: 'wrap', gap: 2, pl: 1, height: { lg: '69px' }, alignContent: { lg: 'center' } }} >
                        <Button href='/'
                            sx={{ color: 'white', textTransform: 'none', fontSize: { xs: '21px', sm: '18px' } }}
                            aria-label='Navigate to homepage'>
                            <i className="fa-solid fa-feather" style={{ marginRight: 6 }}></i>
                            BookMarker
                        </Button>

                        {/* On medium screens and larger, show full navbar */}
                        {matches ?
                            <>
                                <Button href='/books/read'
                                    sx={{ color: 'white', fontSize: 'medium' }}
                                    aria-label='Navigate to read books'>
                                    Read
                                    <i className="fa-solid fa-book" style={{ marginLeft: '4px' }}></i>
                                </Button>
                                <Button href='/books/wish'
                                    sx={{ color: 'white', fontSize: 'medium' }}
                                    aria-label='Navigate to wish to read books'>
                                    Wish To Read
                                    <i className="fa-solid fa-book-open" style={{ marginLeft: '4px' }}></i>
                                </Button>

                                {/* Takes up space between nav links */}
                                <Box sx={{ flexGrow: 1 }} />

                                <Button href='/profile' sx={{ color: 'white', my: 2, fontSize: 'medium' }}>
                                    Profile
                                </Button>
                                <Button href='/' onClick={logout} sx={{ color: 'white', my: 2, fontSize: 'medium' }}>
                                    LogOut
                                </Button>
                            </>
                            :
                            <>
                                {/* On smaller screens, show user menu*/}
                                <Box sx={{ flexGrow: 1 }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                    <Tooltip title="open-menu">
                                        <IconButton
                                            onClick={handleOpenMenu}
                                            size="large"
                                            sx={{ py: 0 }}
                                            aria-controls={open ? 'user-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            <Avatar sx={{ width: 41, height: 40 }}>
                                                {currentUser.username.slice(0, 1).toUpperCase()}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Menu
                                    sx={{ mt: '4.5px' }}
                                    id="menu-list"
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseMenu}
                                    anchorEl={anchorEl}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                >
                                    <MenuItem onClick={handleCloseMenu}>
                                        <Link href="/books/read" underline="none" sx={{ fontSize: '18px' }}
                                            aria-label='Navigate to read books'>
                                            Read
                                            <i className="fa-solid fa-book" style={{ marginLeft: '5px' }}></i>
                                        </Link>
                                    </MenuItem>

                                    <MenuItem onClick={handleCloseMenu}>
                                        <Link href="/books/wish" underline="none" sx={{ fontSize: '18px' }}
                                            aria-label='Navigate to wish to read books'>
                                            Wish To Read
                                            <i className="fa-solid fa-book-open" style={{ marginLeft: '5px' }}></i>
                                        </Link>
                                    </MenuItem>

                                    <MenuItem onClick={handleCloseMenu}>
                                        <Link href="/profile" underline="none" sx={{ fontSize: '18px' }}>
                                            Profile
                                        </Link>
                                    </MenuItem>

                                    <MenuItem onClick={handleLogout}>
                                        <Link href="/" underline="none" sx={{ fontSize: '18px' }}>
                                            Logout
                                        </Link>
                                    </MenuItem>
                                </Menu>
                            </>
                        }
                    </Toolbar>
                </AppBar>
            </Box >
        )
    };

    function loggedOutNav() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{
                    backgroundColor: '#748cab',
                    boxShadow: 'none'
                }}>
                    <Toolbar sx={{ flexWrap: 'wrap', height: { lg: '69px' }, alignContent: { lg: 'center' } }}>
                        <Button href='/'
                            sx={{ pl: { xs: 0 }, textTransform: 'none', color: 'white', fontSize: '19px' }}
                            aria-label='Navigate to homepage'>
                            <i className="fa-solid fa-feather" style={{ marginRight: 6 }}></i>
                            BookMarker
                        </Button>

                        <Box sx={{ flexGrow: 1 }} />

                        <Button href='/login' sx={{ mr: 1, my: 2, color: 'white', fontSize: { xs: '15px', sm: 'medium' } }}>
                            Login
                        </Button>
                        <Button href='/signup' sx={{ pl: 0, color: 'white', fontSize: { xs: '15px', sm: 'medium' } }}>
                            Sign Up
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box >
        )
    };

    return (
        <>
            {currentUser ? loggedInNav() : loggedOutNav()}
        </>
    );
};

export default NavBar;
