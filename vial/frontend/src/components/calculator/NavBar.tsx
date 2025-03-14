import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useState } from 'react';

interface SignInPopup {
    open: boolean;
    onClose: () => void;
    signInHandler: (email: string, password: string) => Promise<string>;
    signUpHandler: (email: string, password: string) => Promise<string>;
}

const SignInPopup: React.FC<SignInPopup> = ({ open, onClose, signInHandler, signUpHandler }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSignIn = async () => {
        const errMsg = await signInHandler(username, password);
        if (errMsg === '') {
            console.log("Error in sign in" + errMsg);
            onClose();
        } else {
            setError(errMsg);
        }
    };

    const handleSignUp = async () => {
        const errMsg = await signUpHandler(username, password);
        console.log("error in sign up" + errMsg);
        if (errMsg === '') {
            onClose();
        } else {
            setError(errMsg);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle color="black">Sign In</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    type="text"
                    fullWidth
                    value={username}
                    onChange={handleUsernameChange}
                    color="primary"
                    inputProps={{ style: { color: 'black' }}}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    color="primary"
                    inputProps={{ style: { color: 'black' } }}
                />
                <Typography color="error">{error}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={async() => handleSignIn()} variant="contained" color="primary">
                    Sign In
                </Button>
                <Button onClick={async() => handleSignUp()} variant="contained" color="primary">
                    Sign Up
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface NavbarProps {
    username: string;
    onSignOut: () => void;
    signInHandler: (email: string, password: string) => Promise<string>;
    signUpHandler: (email: string, password: string) => Promise<string>;
}

const Navbar: React.FC<NavbarProps> = ({ username, onSignOut,  signInHandler, signUpHandler }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <Typography variant="h6">
                        Sin / Cos = Tan
                    </Typography>
                    {username !== "" ? (
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                        <Typography variant="subtitle1" style={{ marginRight: '16px' }}>
                            Signed in as {username}
                        </Typography>
                        <Button color="inherit" onClick={onSignOut}>
                            Sign Out
                        </Button>
                        </div>
                    ) : (
                        <>
                        <Button color="inherit" style={{ marginLeft: 'auto' }} onClick={handleOpenPopup}>
                            Sign In
                        </Button>
                        <SignInPopup 
                            open={isPopupOpen} 
                            onClose={handlePopupClose} 
                            signInHandler={signInHandler}
                            signUpHandler={signUpHandler}
                        />
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;



