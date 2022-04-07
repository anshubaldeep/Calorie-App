import React, { useEffect, useState, Suspense } from 'react';
import {db} from '../../../firebase-config';
import {collection, addDoc, Timestamp, onSnapshot, orderBy, where, query, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import AddItemDialog from '../../../components/DialogForm';
import { formItems, formItemsAdmin, rowTitles } from '../../../helper';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '@mui/material';

const rowTitlesAdmin = [
    ...rowTitles,
    {
        id: 'emailUsed',
        label: 'Email',
        value: 'emailUsed'
    },
    {
        id: 'operations',
        label: 'Operations',
        value: 'operations'
    }
]

const AllRecords=()=>{
    const [products, setproducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addItemDialog, setAddItemDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const initialData = {
        itemName: '',
        itemPrice: '',
        itemCalories: '',
        emailUsed: '',
        consumedAt: new Date(),
    }
    const [data, setItemData] = useState(initialData);

    const getProducts = () => {
        setLoading(true);
        let date = new Date();
        date.setDate(date.getDate() - 7);
        date.setHours(0,0,0,0);
        const q = query(collection(db, 'FoodItems'), where("consumedAt", ">", Timestamp.fromDate(date)), orderBy("consumedAt", "asc"));
        onSnapshot(q, (querySnapshot) => {
            setproducts(querySnapshot.docs.map(d=>({
                id: d.id,
                data: d.data()
            })));
            setLoading(false);
        })
    }

    const handleDelete = async (id) => {
        console.log(id)
        const taskDocRef = doc(db, 'FoodItems', id)
        try{
          await deleteDoc(taskDocRef)
          toast.success('Deleted successfully')
        } catch (err) {
          toast.error(err.message)  
          alert(err)
        }
      }

      const handleUpdateData = async (id) => {
        console.log(id);
        const taskDocRef = doc(db, 'FoodItems', id)
        try{
          await updateDoc(taskDocRef, {
            itemPrice: data.itemPrice,  
            itemName: data.itemName,
            itemCalories: data.itemCalories,
            consumedAt: data.consumedAt,
            dateString: format(data.consumedAt, 'MM/dd/yyyy'),
            monthString: format(data.consumedAt, 'MM'),
          })
          toast.success('Updated successfully')
          setAddItemDialog(false);
        } catch (err) {
          toast.error(err.message)
          alert(err)
        }    
      }

      const handleAddItemData = async () => {
        const taskDocRef = addDoc(collection(db, 'FoodItems'), {
            itemName: data.itemName,
            itemPrice: data.itemPrice,  
            itemCalories: data.itemCalories,
            consumedAt: data.consumedAt,
            emailUsed: data.emailUsed,
            created: Timestamp.now(),
            dateString: format(data.consumedAt, 'MM/dd/yyyy'),
            monthString: format(data.consumedAt, 'MM'),
        })
        try{
          await taskDocRef
          toast.success('Added successfully')
          setAddItemDialog(false);
        } catch (err) {
          toast.error(err.message)
          alert(err)
        }
      }

      const handleUpdate = (id) => {
        const selectedProduct = products.find(p=>p.id===id).data;
        const selectedId = products.find(p=>p.id===id).id;
        setItemData({
            ...selectedProduct,
            id: selectedId,
            consumedAt: new Date(selectedProduct.consumedAt.toDate())
        });
        setIsUpdate(true);
        setAddItemDialog(true);
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

    const handleAddItem = () => {
        setAddItemDialog(true);
        setIsUpdate(false);
        setItemData(initialData);
    }

    useEffect(() => {
        getProducts();     
    }, []);

    return(
        <>
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1em' }}>
                    <Button variant="contained" onClick={handleAddItem}>Add Item</Button>
                </div>
                {loading ? <Loading /> : products.length ? <Table rowTitles={rowTitlesAdmin} rows={products} admin handleDelete={handleDelete} handleEdit={handleUpdate} /> : <h1>No Items added in last 7 days!</h1>}
            </div>
            <Suspense fallback={<Loading/>}>
                <AddItemDialog 
                    open={addItemDialog}
                    onClose={()=>setAddItemDialog(false)} 
                    data={data} 
                    handleChange={handleChange} 
                    addItem={isUpdate ? handleUpdateData : handleAddItemData}
                    update={isUpdate}
                    formItems={isUpdate ? formItems :formItemsAdmin}
                />
            </Suspense>
        </>
    );
}

export default AllRecords;