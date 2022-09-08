import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState, useRef } from "react";
import { Issue } from "jira.js/out/version2/models";
import { useSnachbar } from "./context/SnackbarContext";

interface AddIssueDialogProps {
  addIssues: Issue[];
  open: boolean;
  setOpen: (open: boolean) => void;
  setAddIssues: (addIssues: Issue[]) => void;
}

export const AddIssueDialog: React.FC<AddIssueDialogProps> = ({
  addIssues,
  open,
  setOpen,
  setAddIssues,
}) => {
  const textInput = useRef();
  const { handleOpenSnackbar } = useSnachbar();

  const handleCloseIssue = () => {
    setOpen(false);
  };

  const addIssuesFromText = () => {
    fetch("http://localhost:3100/myIssues/" + textInput.current.value, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        if (data) {
          const hasIssues = addIssues.findIndex((item) => item.id === data.id);
          if (hasIssues === -1) {
            const newIssues = [...addIssues, data];
            setAddIssues(newIssues);
            localStorage.setItem("issues", JSON.stringify(newIssues));
          } else {
            addIssues[hasIssues] = data;
            setAddIssues(addIssues);
            localStorage.setItem("issues", JSON.stringify(addIssues));
          }
          handleOpenSnackbar();
          handleCloseIssue();
        }
      });
  };

  return (
    <Dialog open={open} onClose={handleCloseIssue}>
      <DialogTitle>Add Issue</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          type="text"
          inputRef={textInput}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseIssue}>Cancel</Button>
        <Button onClick={addIssuesFromText}>Add Issue</Button>
      </DialogActions>
    </Dialog>
  );
};
