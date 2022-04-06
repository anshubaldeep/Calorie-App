import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { rowTitles } from './helper';
import { toDate } from 'firebase/firestore';
import { format, parse, parseJSON } from 'date-fns'

export default function BasicTable({rows}) {
return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          {React.Children.toArray(rowTitles.map((r,id)=><TableCell align={id!==0 ? "right" : "left"}><strong>{r.label}</strong></TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.itemName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {React.Children.toArray(rowTitles.map((r,id)=>(
                    <TableCell component={id ===0 ? "th" : "td"} scope={id === 0 ? "row" : ""} align={id!==0 ? "right" : "left"}>
                        {r.value !== 'consumedAt' ? row[r.value] : format(parseJSON(row?.[r.value].toDate()), 'MM/dd/yyyy hh:mm a')}
                    </TableCell>
                )))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
