import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';


export default function FormDialog({open, onClose, data, handleChange, addItem, update=false, formItems}) {
  console.log(data)  
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>{update ? 'Update' : 'Add'} Meal &#127791;</DialogTitle>
    <DialogContent>
        {React.Children.toArray(formItems.map(item=> item.type !== 'date' ? (
            <TextField
                autoFocus
                margin="dense"
                id={item.key}
                label={item.label}
                type={item.type}
                value={data?.[item.value]}
                fullWidth
                variant="standard"
                onChange={(e)=>handleChange(e, item.value, item.type)}
            />
        ) : 
        (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label={item.label}
                    value={data?.[item.value]}
                    onChange={(e)=>handleChange(e, item.value, item.type)}
                    renderInput={(params) => <TextField {...params} fullWidth variant="standard" />}
                />
            </LocalizationProvider>
        )
        ))}
    </DialogContent>
    <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={update ? ()=>addItem(data?.id) : ()=>addItem()}>{update ? 'Update' : 'Add'}</Button>
    </DialogActions>
    </Dialog>
  );
}
