import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
} from "@mui/material";
import { shell } from "@tauri-apps/api";
import { secondsToHours } from "date-fns";
import { Issue, SearchResults } from "jira.js/out/version2/models";
import { useState } from "react";
import { AddIssueDialog } from "./AddIssueDialog";
import "./App.css";
import { Timer } from "./components/Timer/Timer";
import { useSnachbar } from "./context/SnackbarContext";

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [addIssues, setAddIssues] = useState<Issue[]>(
    localStorage.getItem("issues")
      ? JSON.parse(localStorage.getItem("issues") || "")
      : []
  );
  const [issueId, setIssueId] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [openAddIssue, setOpenAddIssue] = useState(false);
  const { openSnackbar, handleCloseSnackbar } = useSnachbar();

  const change = (e) => {
    setValue(e.target.value);
  };

  const handleClickOpenIssue = () => {
    setOpenAddIssue(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchIssues = async () => {
    fetch("http://localhost:3100/myIssues", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data: SearchResults) => {
        setIssues(data?.issues || []);
      });
  };

  const addWorkload = (id: string) => {
    setIssueId(id);
    handleClickOpen();
  };

  const spent = () => {
    if (issueId && value) {
      fetch(`http://localhost:3100/myIssues/${issueId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
        });
    }
  };

  const removeIssue = (id: string) => {
    const newIssues = addIssues.filter((item) => item.id !== id);
    console.log("id", id);
    console.log("newIssues", newIssues);
    setAddIssues(newIssues);
    localStorage.setItem("issues", JSON.stringify(newIssues));
  };

  const getTime = (issue: any) => {
    return issue.fields?.aggregatetimespent
      ? secondsToHours(issue.fields?.aggregatetimespent)
      : 0;
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Box>
            <Button color="inherit" onClick={handleClickOpenIssue}>
              Add Issue
            </Button>
            <Button color="inherit" onClick={fetchIssues}>
              Load my Issue
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xl">
        <Paper variant="outlined">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addIssues.map((issue) => {
                  return (
                    <TableRow
                      key={issue.key}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Link
                          href={`https://portal.mssys.de/jira/browse/${issue.key}`}
                          rel="noopener"
                          onClick={(e) => {
                            e.preventDefault();
                            shell.open(
                              `https://portal.mssys.de/jira/browse/${issue.key}`
                            );
                          }}
                        >
                          {issue.key}
                        </Link>
                      </TableCell>
                      <TableCell>{issue.fields.summary}</TableCell>
                      <TableCell>{getTime(issue)}</TableCell>
                      <TableCell>
                        <Button onClick={() => removeIssue(issue.id)}>
                          Remove
                        </Button>
                        <Button onClick={() => addWorkload(issue.key)}>
                          Spent Time
                        </Button>
                        <Timer />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {issues.map((issue) => {
                  return (
                    <TableRow
                      key={issue.key}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Link
                          href={`https://portal.mssys.de/jira/browse/${issue.key}`}
                          rel="noopener"
                          onClick={(e) => {
                            e.preventDefault();
                            shell.open(
                              `https://portal.mssys.de/jira/browse/${issue.key}`
                            );
                          }}
                        >
                          {issue.key}
                        </Link>
                      </TableCell>
                      <TableCell>{issue.fields.summary}</TableCell>
                      <TableCell>{getTime(issue)}</TableCell>
                      <TableCell>
                        <Button onClick={() => addWorkload(issue.key)}>
                          Spent Time
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <AddIssueDialog
            open={openAddIssue}
            setOpen={setOpenAddIssue}
            addIssues={addIssues}
            setAddIssues={setAddIssues}
          />
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Time</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You can add spendet time to issue for example type 1h for one
                hour, 30m for 30 minutes and 1d for 1 day
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                onChange={change}
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={spent}>Subscribe</Button>
            </DialogActions>
          </Dialog>
        </Paper>
        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          autoHideDuration={2000}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            This is a success message!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default App;
