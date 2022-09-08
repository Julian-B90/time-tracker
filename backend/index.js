const express = require("express");
const app = express();
const port = process.env.PORT || 3100;
const cors = require("cors");
// const bodyParser = require('body-parser');
const { Version2Client } = require("jira.js");

const client = new Version2Client({
  host: "https://portal.mssys.de/jira",
  newErrorHandling: true,
  authentication: {
    personalAccessToken: "MjkzMjU1MTgwOTcyOkoo5HnjJ7msLpbAAk1nVtTV/TKZ",
  },
});

app.use(cors());
app.use(express.json());

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.get("/myIssues", async function (req, res) {
  const time = await client.issueSearch.searchForIssuesUsingJql({
    fields: ["aggregatetimespent", "summary"],
    jql: "assignee = currentUser()  AND status was not in (Fertig, Gelöst, Abgeschlossen, Ausgeliefert)",
  });
  res.send(time);
});

app.get("/myIssues/:id", async function (req, res) {
  const { id } = req.params;
  const issue = await client.issues
    .getIssue({ issueIdOrKey: id, fields: ["aggregatetimespent", "summary"] })
    .catch(console.error);
  res.send(issue);
});

app.post("/myIssues/:id/add", async function (req, res) {
  const { id } = req.params;
  const { value } = req.body;
  const data = await client.issueWorklogs
    .addWorklog({
      issueIdOrKey: id,
      timeSpent: value,
    })
    .catch(console.error);
  if (data) {
    res.status(201).send(data);
    return;
  }
  res.sendStatus(500);
});
