import { Button, Typography, Tabs, Tab, Box } from '@mui/material';
import './index.css';
import TabPanel from '../../components/TabPanel';
import Report from './Report';
import AllRecords from './AllRecords';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}
  

export default function Admin() {

    const [tabValue, setTabValue] = useState(0);

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
        <div className='adminSection'>
            <div className='topLine'>
                <Typography variant='h4'>Admin &#128187;</Typography>
                <div className='buttonGroup'>
                    <Button variant="contained" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
            <div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={(e,n)=>setTabValue(n)} sx={{
                        '& .MuiTabs-flexContainer': {
                            gap: '3em',
                        }
                    }}>
                        <Tab label="All Food Entries" {...a11yProps(0)} />
                        <Tab label="Reports" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <AllRecords />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                   <Report />
                </TabPanel>
                </Box>
            </div>
        </div>
    )
}
