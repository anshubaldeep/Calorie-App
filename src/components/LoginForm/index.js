import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BasicTextFields({ title }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
    
        if (authToken) {
          navigate('/home')
        }
      }, []);

    const handleAction = (id) => {
        const authentication = getAuth();

        if (title === "Register") {
            createUserWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                sessionStorage.setItem('User', response.user.email)
                if(response.user.email === 'admin@admin.com') {
                    navigate('/admin')
                } else {
                    navigate('/home')
                }
            })
            .catch((error) => {
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        navigate('/login')
                        toast.error('Email already in use')
                        break;
                }
              })
        }
        if (title === "Login") {
            signInWithEmailAndPassword(authentication, email, password)
              .then((response) => {
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                sessionStorage.setItem('User', response.user.email)
                if(response.user.email === 'admin@admin.com') {
                    navigate('/admin')
                } else {
                    navigate('/home')
                }
              })
              .catch((error) => {
                switch(error.code) {
                    case 'auth/user-not-found':
                        navigate('/register')
                        toast.error('Please register this Email first');
                        break;
                    case 'auth/wrong-password':
                        toast.error('Wrong Password');
                        break;
                }
              })
        }
    };
    return (
        <div>
            <div className="heading-container">
                <h3>
                    {title} Form
                </h3>
            </div>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField type="email" id="email" label="Enter the Email" variant="outlined" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <TextField type="password" id="password" label="Enter the Password" variant="outlined" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </Box>
            <Button variant="contained" onClick={handleAction}>{title}</Button>
        </div>
    );
}