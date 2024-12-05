import  { useState } from "react";
import { Box, TextField, Button, Typography, Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
import Swal from "sweetalert2";

const App = () => {
  const [numProcesses, setNumProcesses] = useState("");
  const [quantumSize, setQuantumSize] = useState("");
  const [processes, setProcesses] = useState([]);
  const [logs, setLogs] = useState([]);

  const handleAddProcess = () => {
    if (processes.length >= 5) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Maximum of 5 processes allowed!",
      });
      return;
    }

    Swal.fire({
      title: "Enter Arrival Time (>= 0):",
      input: "number",
      inputAttributes: { min: 0 },
      showCancelButton: true,
      preConfirm: (arrivalTime) => {
        if (arrivalTime === "") {
          Swal.showValidationMessage("Please enter a valid number.");
        }
        return arrivalTime;
      },
    }).then(({ value: arrivalTime }) => {
      if (!arrivalTime) return;

      Swal.fire({
        title: "Enter Execution Time (1-10):",
        input: "number",
        inputAttributes: { min: 1, max: 10 },
        showCancelButton: true,
        preConfirm: (executionTime) => {
          if (executionTime < 1 || executionTime > 10) {
            Swal.showValidationMessage("Please enter a valid execution time.");
          }
          return executionTime;
        },
      }).then(({ value: executionTime }) => {
        if (!executionTime) return;

        setProcesses([
          ...processes,
          {
            id: processes.length + 1,
            arrivalTime: parseInt(arrivalTime),
            executionTime: parseInt(executionTime),
            remainingTime: parseInt(executionTime),
            state: "Ready",
            quantumSize: quantumSize,
          },
        ]);
      });
    });
  };

  // const handleStartSimulation = () => {
  //   if (!numProcesses || !quantumSize) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Please provide valid inputs for number of processes and quantum size.",
  //     });
  //     return;
  //   }

  //   const quantum = parseInt(quantumSize);
  //   if (quantum < 1 || quantum > 3) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Quantum size must be between 1 and 3.",
  //     });
  //     return;
  //   }

  //   let queue = [...processes];
  //   let currentTime = 0;
  //   let simulationLogs = [];

  //   while (queue.length > 0) {
  //     let process = queue.shift();

  //     if (process.state === "Completed") continue;

  //     simulationLogs.push(
  //       `<li>Process ${process.id} <br />
  //       Execution Time: ${process.executionTime} <br />
  //       Arrival Time: ${process.arrivalTime} <br />
  //       Quantum Size: ${process.quantumSize} <br />
  //       Status: Running <br />
  //       Remaining Time: ${process.remainingTime} <br />
  //       Clock Time: ${currentTime} <br />
  //       IR: Executing Process ${process.id} <br />
  //       PC: ${currentTime}</li>`
  //     );

  //     let executeTime = Math.min(process.remainingTime, quantum);
  //     process.remainingTime -= executeTime;
  //     currentTime += executeTime;

  //     if (process.remainingTime > 0) {
  //       process.state = "Ready";
  //       queue.push(process);
  //       simulationLogs.push(
  //         `<li>Remaining Time: ${process.remainingTime} <br />
  //         Clock Time: ${currentTime} <br />
  //         Status: Ready <br />
  //         Resume Instruction: Resume from instruction ${currentTime}</li>`
  //       );
  //     } else {
  //       process.state = "Completed";
  //       simulationLogs.push(
  //         `<li>Remaining Time: 0 <br />
  //         Clock Time: ${currentTime} <br />
  //         Status: Completed <br />
  //         Process ${process.id} completed at time ${currentTime}.</li>`
  //       );
  //     }
  //   }

  //   setLogs(simulationLogs);
  // };

  const handleStartSimulation = () => {
    if (!numProcesses || !quantumSize) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide valid inputs for number of processes and quantum size.",
      });
      return;
    }
  
    const quantum = parseInt(quantumSize);
    if (quantum < 1 || quantum > 3) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Quantum size must be between 1 and 3.",
      });
      return;
    }
  
    // Sort the processes by arrival time before simulation starts
    let queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    let simulationLogs = [];
    let completedProcesses = 0;
  
    while (completedProcesses < processes.length) {
      let executed = false;
  
      for (let i = 0; i < queue.length; i++) {
        let process = queue[i];
  
        if (process.arrivalTime <= currentTime && process.state !== "Completed") {
          executed = true;
  
          simulationLogs.push(
            `<li>Process ${process.id} <br />
            Execution Time: ${process.executionTime} <br />
            Arrival Time: ${process.arrivalTime} <br />
            Quantum Size: ${process.quantumSize} <br />
            Status: Running <br />
            Remaining Time: ${process.remainingTime} <br />
            Clock Time: ${currentTime} <br />
            IR: Executing Process ${process.id} <br />
            PC: ${currentTime}</li>`
          );
  
          let executeTime = Math.min(process.remainingTime, quantum);
          process.remainingTime -= executeTime;
          currentTime += executeTime;
  
          if (process.remainingTime > 0) {
            process.state = "Ready";
            simulationLogs.push(
              `<li>Remaining Time: ${process.remainingTime} <br />
              Clock Time: ${currentTime} <br />
              Status: Ready <br />
              Resume Instruction: Resume from instruction ${currentTime}</li>`
            );
          } else {
            process.state = "Completed";
            completedProcesses++;
            simulationLogs.push(
              `<li>Remaining Time: 0 <br />
              Clock Time: ${currentTime} <br />
              Status: Completed <br />
              Process ${process.id} completed at time ${currentTime}.</li>`
            );
          }
        }
      }
  
      // If no process was executed, increment the clock time
      if (!executed) {
        currentTime++;
      }
    }
  
    setLogs(simulationLogs);
  };

  const handleReset = () => {
    setNumProcesses("");
    setQuantumSize("");
    setProcesses([]);
    setLogs([]);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Process Control Block Using Roung Robin Scheduler
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <TextField
            label="Number of Processes"
            type="number"
            value={numProcesses}
            onChange={(e) => setNumProcesses(e.target.value)}
            helperText="Max 5 processes"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Quantum Size"
            type="number"
            value={quantumSize}
            onChange={(e) => setQuantumSize(e.target.value)}
            helperText="Max 3"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddProcess}>
            Add Process
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Processes
      </Typography>
      <Paper sx={{ mb: 4, p: 2 }}>
        <List>
          {processes.map((process) => (
            <ListItem key={process.id}>
              <ListItemText
                primary={`Process ID: ${process.id}`}
                secondary={`Arrival Time: ${process.arrivalTime} | Execution Time: ${process.executionTime} | Remaining Time: ${process.remainingTime}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Button
        variant="contained"
        color="success"
        sx={{ mr: 2 }}
        onClick={handleStartSimulation}
      >
        Start Simulation
      </Button>
      <Button variant="outlined" color="error" onClick={handleReset}>
        Reset
      </Button>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Simulation Logs
      </Typography>

      <Paper sx={{ p: 2, border: "1px solid #ccc", borderRadius: "4px" }}>
        <List>
          {logs.map((log, index) => (
            <ListItem key={index}>
              <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: log }} />} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default App;
