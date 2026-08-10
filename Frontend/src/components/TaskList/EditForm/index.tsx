import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { CirclePlus } from 'lucide-react';
import type { FormEvent } from 'react';

interface DefaultFormProps {
  taskToEdit: string;
  saveEditedTask: (event: FormEvent<HTMLFormElement>) => void;
  editedTaskValue: {
    task: any;
    id: number;
  };
}

export default function EditForm({
  taskToEdit,
  saveEditedTask,
  editedTaskValue,
}: DefaultFormProps) {
  return (
    <>
      <Box
        onSubmit={(event) => saveEditedTask(event)}
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
          defaultValue={taskToEdit}
          autoFocus={true}
        />
        <button type="submit" className="h-8 max-w-max py-0">
          <CirclePlus className="text-green-400 p-0" />
        </button>
      </Box>
    </>
  );
}
