import { Button } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        sessionStorage.removeItem('User');
        navigate('/login')
        toast.success('Logged out successfully')
    }

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        let user = sessionStorage.getItem('User')

        if (authToken) {
            if(user === 'admin@admin.com'){
                navigate('/admin')
            } else {
                navigate('/home')
            }
        }

        if (!authToken) {
            navigate('/login')
        }
    }, []);
    
    return (
        <div>
            <h1>Admin Page</h1>
            <Button variant="contained" onClick={handleLogout}>Logout</Button>
        </div>
    )
}
