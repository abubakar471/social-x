import * as React from 'react';
import Link from "next/link";
import styles from "../../styles/Navbar.module.scss";
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ForumIcon from '@mui/icons-material/Forum';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SearchIcon from '@mui/icons-material/Search';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));


const Loading = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        const handleStart = (url) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url) => (url === router.asPath) && setTimeout(() => {
            setLoading(false);
        }, 1000);

        router.events.on('routeChangeStart', handleStart);
        // router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeComplete', (url) => {
            console.log(`completely routed to ${url}`);
            setLoading(false);
        });
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        }

    });

    return loading && (
        <Box sx={{ width: '100%' }} className={styles.spinner}>
            <LinearProgress />
        </Box>
    )
}



function Navbar() {
    const router = useRouter();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [state, setState] = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [drawerOpen, setDrawerOpen] = useState({
        left: false
    })
    const handleSignout = () => {
        window.localStorage.removeItem("user");
        setState(null);
        router.push("/signin");
    }

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const settings = ['Profile', 'Account', 'Logout'];



    // responsive navbar drawer

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerOpen({ ...state, [anchor]: open });
    };


    const list = () => (
        <Box
            sx={{ width: 300 }}
            role="presentation"
        // onClick={toggleDrawer('left', false)}
        // onKeyDown={toggleDrawer('left', false)}
        >
            <List>
                <IconButton onClick={toggleDrawer('left', false)}>
                    <KeyboardReturnIcon

                        className={styles.nav__return__icon}
                    />
                </IconButton>

                {['home', 'profile', 'friends'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemText >
                                <Link onClick={toggleDrawer('left', false)} onKeyDown={toggleDrawer('left', false)}
                                    href={text === 'home' ? '/' : text === 'profile' ? '/user/profile' : `/${text}`}>{text.toUpperCase()}</Link>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
                <form className={styles.nav__search} onSubmit={handleSearch}>
                    <TextField type="search" placeholder='search'
                        id="outlined-basic"
                        label="search"
                        variant="outlined"
                        className={styles.nav__search_input}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button className={styles.nav__search__btn} type='submit' variant="contained">search</Button>
                </form>
            </List>
        </Box>
    );

    const handleSearch = async(e) => {
        e.preventDefault();
        try{
            router.push(`/search?searchQuery=${searchQuery}`);
        } catch(err){
            console.log(err);
        }
    }


    return (
        <div className={styles.navbar_container}>
            <div className={styles.navbar}>
                <div className={styles.logo_container}>
                    <IconButton>
                        <MenuIcon onClick={toggleDrawer('left', true)} />
                    </IconButton>
                    <img src="/images/logo2.png" className={styles.logo} alt="logo" />

                    <Link href="/" passHref className={styles.logo_text}>Social X</Link>

                    <form onSubmit={handleSearch} className={styles.nav__search__container}>
                        <SearchIcon className={styles.nav__search__icon} />
                        <input className={styles.nav__search__input} type="search" placeholder='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                        <SearchIcon className={styles.nav__resp__search__icon} />
                    </form>
                </div>
                {
                    state !== null && (
                        <div className={styles.nav_links}>
                            <Link href="/" passHref className={styles.nav_link}>
                                {router.pathname == '/' ? <HomeIcon className={styles.nav_link_icon} /> : <HomeOutlinedIcon className={styles.nav_link_icon} />}
                            </Link>
                            <Link href="/friends" passHref className={styles.nav_link}>
                                {router.pathname == '/friends' ? <PeopleAltIcon className={styles.nav_link_icon} /> : <PeopleAltOutlinedIcon className={styles.nav_link_icon} />}
                            </Link>
                            <Link href="/trendings" passHref className={styles.nav_link}>
                               <WhatshotIcon className={styles.nav_link_icon} />
                            </Link>
                        </div>
                    )
                }
                <div>
                    
                    <Drawer
                        anchor={'left'}
                        open={drawerOpen['left']}
                        onClose={toggleDrawer('left', false)}
                    >

                        {list('left')}
                    </Drawer>
            

                    {state !== null ? (
                        <div>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant="dot"
                                        >
                                            <Avatar alt="Remy Sharp" src={state && state.user.image ? (state.user.image.url) : ('/images/default.png')} />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center">
                                                {
                                                    (setting === 'Logout') ? (
                                                        <span className={styles.nav_menu_container}
                                                            onClick={handleSignout}>
                                                            <LogoutIcon />Sign Out
                                                        </span>
                                                    ) : ((setting === 'Account') ? (
                                                        <Link className={styles.nav_menu_container} href="/user/account/update" passHref>
                                                            {setting}
                                                        </Link>) : (<Link className={styles.nav_menu_container} href="/user/profile" passHref>
                                                            {setting}
                                                        </Link>))
                                                }
                                                {/* {
                                                    (setting === 'Logout') ? (
                                                        <p className={styles.nav_menu_container} onClick={handleSignout} ><LogoutIcon />Sign Out</p>
                                                    ) : (setting)
                                                } */}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            {/* <Avatar alt="Remy Sharp" src="/images/logo4.png" />
                               <a style={{ cursor: "pointer" }} onClick={handleSignout} className={styles.auth_link}>Sign Out</a> */}
                        </div>
                    ) : (<div>
                        <Link href="/signup" className={styles.auth_link} passHref>Sign Up</Link>
                        <Link href="/signin" className={styles.auth_link} passHref>Sign In</Link>
                    </div>)}
                </div>
            </div>
            <Loading />
        </div>
    );
};
export default Navbar