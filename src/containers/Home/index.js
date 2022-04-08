import { Button } from '@mui/material';
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import {db} from '../../firebase-config';
import {collection, addDoc, Timestamp, onSnapshot, orderBy, where, query} from 'firebase/firestore'
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Loading from '../../components/Loading';
import Table from '../../components/Table';
import { format } from 'date-fns';
import { Typography } from '@mui/material';
import { formItems, rowTitles } from '../../helper';
const AddItemDialog = lazy(() => import('../../components/DialogForm'));

export default function Home() {
    const [addItemDialog, setAddItemDialog] = useState(false);
    const [products, setproducts] = useState([]);
    const [productsForMonth, setproductsForMonth] = useState([]);
    const [filterDate, setFilterDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [thresholdReached, setThresholdReached] = useState(false);
    const [monthlyPriceThresholdReached, setMonthlyPriceThresholdReached] = useState(false);
    const initialData = {
        itemName: '',
        itemPrice: '',
        itemCalories: '',
        consumedAt: new Date(),
    };
    const [data, setItemData] = useState(initialData);
    const [threshold, setThreshold] = useState(null);
    const [moneyThreshold, setMoneyThreshold] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        sessionStorage.removeItem('User');
        navigate('/login')
        toast.success('Logged out successfully')
    }
    
    const getProducts = (date) => {
        setLoading(true);
        const q = query(collection(db, 'FoodItems'), where("emailUsed", "==", sessionStorage.getItem('User')), where("dateString", "==", format(date, 'MM/dd/yyyy')), orderBy("consumedAt", "asc"));
        onSnapshot(q, (querySnapshot) => {
            setproducts(querySnapshot.docs.map(d=>d.data()))
            setLoading(false);
        })
    }
    
    const getProductsForMonth = (date) => {
        const q = query(collection(db, 'FoodItems'), where("emailUsed", "==", sessionStorage.getItem('User')), where("monthString", "==", format(date, 'MM')), orderBy("consumedAt", "asc"));
        onSnapshot(q, (querySnapshot) => {
            setproductsForMonth(querySnapshot.docs.map(d=>d.data()))
        })
    }  

    const getUserData = () => {
        const q = query(collection(db, 'Users'), where("user", "==", sessionStorage.getItem('User')));
        onSnapshot(q, (querySnapshot) => {
            setMoneyThreshold(querySnapshot.docs.map(d=>d.data())[0].priceLimit);
            setThreshold(querySnapshot.docs.map(d=>d.data())[0].calorieLimit);
        })
    }

    const handleChangeFilterDate = (date) => {
        setFilterDate(date);
        getProducts(date);
        getProductsForMonth(date);
    }
    
    
    const handleChange = (event, val, type) => {
        setItemData({
            ...data,
            [val]: type === 'number' 
                ? parseInt(event.target.value, 10) 
                : type === 'date' 
                    ? event
                    : event.target.value
        });
    }

    const addItem = async () => {
        try {
          await addDoc(collection(db, 'FoodItems'), {
            ...data,
            emailUsed: sessionStorage.getItem('User'),
            created: Timestamp.now(),
            dateString: format(data.consumedAt, 'MM/dd/yyyy'),
            monthString: format(data.consumedAt, 'MM'),
          })
          setAddItemDialog(false);
          setItemData(initialData);
          toast.success('Item added successfully')
        } catch (err) {
          alert(err)
          toast.error(err);
        }
      }
    
    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        let isAdmin = sessionStorage.getItem('isAdmin')

        if (authToken) {
            if(isAdmin !== '0'){
                navigate('/admin')
            }else{
                navigate('/home')
            }
        }

        if (!authToken) {
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        let date = new Date();
        getProducts(date);
        getProductsForMonth(date);
        getUserData();
      }, []);

    useEffect(() => {
        let val = 0;
        products.length && products.map(item => {
            val += item.itemCalories;
        })
        if (val > threshold && threshold) {
            toast.error(`You exceeded your calorie threshold of ${threshold} calories on ${format(filterDate, 'do LLL yyyy')}`);
            setThresholdReached(true);
        } else {
            setThresholdReached(false);
        } 
    }, [products, threshold])


    useEffect(() => {
        let val = 0;
        productsForMonth.length && productsForMonth.map(item => {
            val += item.itemPrice;
        })
        if (val > moneyThreshold && moneyThreshold) {
            toast.error(`You exceeded your monthly money threshold of ${moneyThreshold} USD in ${format(filterDate, 'LLL')}`);
            setMonthlyPriceThresholdReached(true);
        } else {
            setMonthlyPriceThresholdReached(false);
        }
    }, [productsForMonth, moneyThreshold])


    return (
        <div className="homeSection">
            <div className='topLine'>
                <Typography variant='h4'>Home &#127968;</Typography>
                <div className='buttonGroup'>
                    <Button variant="contained" onClick={()=>setAddItemDialog(true)} startIcon={<AddIcon/>}>Add Item</Button>
                    <Button variant="contained" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
            {
                thresholdReached && threshold && (
                    <div className='thresholdReached'>
                        <Typography variant='h5'>You exceeded your calorie threshold of {threshold} calories on {format(filterDate, 'do LLL yyyy')}</Typography>
                    </div>
                )
            }
            {
                monthlyPriceThresholdReached && moneyThreshold && (
                    <div className='thresholdReached'>
                        <Typography variant='h5'>You exceeded your monthly money threshold of {moneyThreshold} USD in {format(filterDate, 'LLL')}</Typography>
                    </div>
                )
            }
            <div className='datePicker'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        disableFuture
                        label="Filter Date"
                        openTo="day"
                        views={['year', 'month', 'day']}
                        value={filterDate}
                        onChange={(newValue) => {
                            handleChangeFilterDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} variant='standard' sx={{ width: '14.5em' }} />}
                    />
                </LocalizationProvider>
            </div>
            {loading ? <Loading /> : products.length ? <Table rows={products} rowTitles={rowTitles} /> : <h1>No Items Covered that day!</h1>}
            <Suspense fallback={<Loading/>}>
                <AddItemDialog 
                    open={addItemDialog}
                    onClose={()=>setAddItemDialog(false)} 
                    data={data} 
                    handleChange={handleChange} 
                    addItem={addItem}
                    formItems={formItems}
                />
            </Suspense>
        </div>
    )
}
