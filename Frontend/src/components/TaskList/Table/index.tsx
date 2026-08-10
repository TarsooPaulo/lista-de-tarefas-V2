import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { FilePenLine, Trash2 } from 'lucide-react';
import * as React from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface Task {
  tasks: string[];
  deleteTask: (taskToDelete: string) => void;
  editTask: (editTask: any, taskIndex: number) => void;
  isEditingTask: boolean;
}

export default function CustomizedTables({
  tasks,
  deleteTask,
  editTask,
  isEditingTask,
}: Task) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tarefas</StyledTableCell>
            <StyledTableCell align="right">Ações</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                <div className="text-base font-sans font-medium">{task}</div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div className="flex justify-end space-x-2">
                  <button onClick={() => editTask(task, index)}>
                    <FilePenLine className="text-sky-700" />
                  </button>
                  <button onClick={() => deleteTask(task)}>
                    <Trash2 className="text-red-700" />
                  </button>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
