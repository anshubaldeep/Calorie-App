import React, { useEffect, useState } from 'react';
import {collection, onSnapshot, orderBy, where, query, groupBy, Timestamp} from 'firebase/firestore';
import { db } from '../../../firebase-config';
import Loading from '../../../components/Loading';
import BarGraph from '../../../components/BarGraph';
import LineGraph from '../../../components/LineGraph';
import './index.css';
import { Typography } from '@mui/material';
import { format } from 'date-fns';


const Report=()=>{
    const [loading, setLoading] = useState(false);
    const [currentWeekEntries, setCurrentWeekEntries] = useState(0);
    const [lastWeekEntries, setLastWeekEntries] = useState(0);
    const [currentWeekProducts, setCurrentWeekProducts] = useState([]);
    const date = new Date();
    const initialDateData = [ ...Array(7) ].map((e,i) => ({ dateString: format(date.setDate(new Date().getDate() - i), 'MM/dd/yyyy'), data: 0 })).reverse();
    const [lineData, setLineData] = useState(initialDateData);
    const [totalUsers, setTotalUsers] = useState(0);
        

    const getProducts = (from, to, type) => {
        setLoading(true);
        const q = query(collection(db, 'FoodItems'), where("consumedAt", ">", Timestamp.fromDate(from)), where("consumedAt", "<=", Timestamp.fromDate(to)));
        onSnapshot(q, (querySnapshot) => {
            type === 'currentWeek' ? setCurrentWeekEntries(querySnapshot.docs.length) : setLastWeekEntries(querySnapshot.docs.length);
            type === 'currentWeek' && setCurrentWeekProducts(querySnapshot.docs.map(d=>d.data()));
            setLoading(false);
        })
    }

    const getUserData = () => {
        const q = query(collection(db, 'Users'), where("isAdmin", "==", false));
        onSnapshot(q, (querySnapshot) => {
            setTotalUsers(querySnapshot.docs.length)
        })
    }

    useEffect(() => {
        let currentWeekDate = new Date();
        let lastWeekDate = new Date();
        let today = new Date();
        currentWeekDate.setDate(currentWeekDate.getDate() - 7);
        lastWeekDate.setDate(lastWeekDate.getDate() - 14);
        lastWeekDate.setHours(0,0,0,0);
        currentWeekDate.setHours(0,0,0,0);
        today.setHours(23,59,59,999);
        getProducts(currentWeekDate, today, 'currentWeek');
        currentWeekDate.setHours(23,59,59,999);
        getProducts(lastWeekDate, currentWeekDate, 'lastWeek');
        getUserData();
    }, []);

    useEffect(() => {
        const updatedLineData = [...lineData];
        if(currentWeekProducts.length && totalUsers){
            currentWeekProducts.map(e=>{
                const date = new Date(e.consumedAt.toDate());
                const dateString = format(date, 'MM/dd/yyyy');
                const index = updatedLineData.findIndex(d=>d.dateString === dateString);
                if(index !== -1){
                    updatedLineData[index].data += e.itemCalories;  
                } else {
                    updatedLineData.push({dateString, data: e.itemCalories})
                }
            });
            const result  = updatedLineData.map(e=>({ dateString: e.dateString, data: Math.round(e.data/totalUsers) }));
            setLineData(result);
        }
    }, [currentWeekProducts, totalUsers]);

    const data = [
        { argument: 'Current Week', value: currentWeekEntries },
        { argument: 'Last Week', value: lastWeekEntries }
    ]

        return(
            <div style={{ padding: '1em' }}>
                {loading 
                ?   <Loading /> 
                :(
                    <div>
                        <Typography variant="h4" sx={{ textAlign: 'left', marginBottom: '1em' }}>Report</Typography>
                        <div className="chartContainer">
                            <div className="chartArea">
                                <BarGraph data={data} title="Number of Entries Added Comparison" />
                            </div>
                            <div className="chartArea">
                                <LineGraph data={lineData} title="Avg Number of Calories Added Per Day Per User" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
}

export default Report;