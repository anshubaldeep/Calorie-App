import React, { useEffect, useState } from 'react';
import './index.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {db} from '../../firebase-config';
import {collection, addDoc, Timestamp, onSnapshot, orderBy, where, query, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography } from '@mui/material';

export default function BasicTextFields({ title, label }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
    
        if (authToken) {
          navigate('/home')
        }
      }, []);

      const getUserData = () => {
          const q = query(collection(db, 'Users'), where("user", "==", sessionStorage.getItem('User')));
          onSnapshot(q, (querySnapshot) => {
            setIsAdmin(querySnapshot.docs.map(d=>d.data())[0].isAdmin);
            sessionStorage.setItem('isAdmin', querySnapshot.docs.map(d=>d.data())[0].isAdmin ? 1 : 0);
          })
      }


    const addItem = async (email) => {
        try {
          await addDoc(collection(db, 'Users'), {
            calorieLimit: 2100,
            user: email,
            isAdmin: false,
            priceLimit: 1000
          })
        } catch (err) {
          alert(err)
        }
      }
    
    const handleAction = (id) => {
        const authentication = getAuth();

        if (title === "Register") {
            createUserWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                sessionStorage.setItem('User', response.user.email)
                addItem(response.user.email);
                getUserData();
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
                getUserData();
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

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token');
        if(authToken){
            if(isAdmin) {
                navigate('/admin')
            } else {
                navigate('/home')
            }
        }
    }, [isAdmin]);

    return (
        <div className="heading-container">
            <div>
                <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                    {label}
                </Typography>
            </div>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2em'
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