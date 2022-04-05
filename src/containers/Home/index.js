import { Button } from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {db} from '../../firebase-config';
import {collection, addDoc, Timestamp, onSnapshot, orderBy, where, query} from 'firebase/firestore'
import AddIcon from '@mui/icons-material/Add';
import Loading from '../../components/Loading';
import AddItemDialog from '../../components/DialogForm';

export default function Home() {
    const [addItemDialog, setAddItemDialog] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        sessionStorage.removeItem('User');
        navigate('/login')
        toast.success('Logged out successfully')
    }

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            navigate('/home')
        }

        if (!authToken) {
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'FoodItems'), where("emailUsed", "==", sessionStorage.getItem('User')))
        onSnapshot(q, (querySnapshot) => {
            console.log(querySnapshot.docs.map(d=>d.data()))
        })
      }, []);

    const [data, setItemData] = useState({
        itemName: '',
        itemPrice: '',
        itemCalories: '',
        consumedAt: new Date(),
    });
    
    const handleChange = (event, val, type) => {
        setItemData({
            ...data,
            [val]: type !== 'number' ? event.target.value : parseInt(event.target.value, 10)
        });
    }

    const addItem = async () => {
        try {
          await addDoc(collection(db, 'FoodItems'), {
            ...data,
            emailUsed: sessionStorage.getItem('User'),
            created: Timestamp.now()
          })
          setAddItemDialog(false);
        } catch (err) {
          alert(err)
        }
      }
    
    return (
        <div>
            <h1>Home Page</h1>
            
            <Button variant="contained" onClick={()=>setAddItemDialog(true)} startIcon={<AddIcon/>}>Add Item</Button>
            <Button variant="contained" onClick={handleLogout}>Logout</Button>
            <Suspense fallback={<Loading/>}>
                <AddItemDialog 
                    open={addItemDialog}
                    onClose={()=>setAddItemDialog(false)} 
                    data={data} 
                    handleChange={handleChange} 
                    addItem={addItem}
                />
            </Suspense>
        </div>
    )
}
