import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { CirclePlus } from 'lucide-react';
import type { FormEvent } from 'react';

interface DefaultFormProps {
  saveTask: (event: FormEvent<HTMLFormElement>) => void;
  tasks: string[];
  deleteTask: (taskToDelete: string) => void;
  editTask: (editTask: any, taskIndex: number) => void;
}

export default function DefaultForm({
  saveTask,
  tasks,
  deleteTask,
  editTask,
}: DefaultFormProps) {
  return (
    <>
      <Box
        onSubmit={(event) => saveTask(event)}
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        className=" flex justify-center items-center mt-1"
      >
        <TextField
          id="outlined-basic"
          label="Adicione uma tarefa"
          variant="outlined"
          name="task"
        />
        <button type="submit" className="h-8 max-w-max py-0">
          <CirclePlus className="text-green-400 p-0" />
        </button>
      </Box>
    </>
  );
}
