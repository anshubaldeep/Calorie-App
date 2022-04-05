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
import {formItems} from  './helper';

export default function FormDialog({open, onClose, data, handleChange, addItem}) {
 
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>Add Meal</DialogTitle>
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
        <Button onClick={addItem}>Add</Button>
    </DialogActions>
    </Dialog>
  );
}
