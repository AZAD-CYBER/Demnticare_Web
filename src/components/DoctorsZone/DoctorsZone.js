import React, { useEffect } from "react";
import "./DoctorsZone.css";
import Calendar from "react-calendar";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import {
  TableContainer,
  Paper,
  Table,
  makeStyles,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from "@material-ui/core";
import Sidebar from "../Sidebar/Sidebar";
import FullHeight from "react-full-height";
import { db } from "../../firebase";
const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

const DoctorsZone = () => {
  const [initialDate, setInitialDate] = useState(new Date());
  const [appointment, setAppointment] = useState([]);
  const [key, setKey] = useState(null);
  const [action, setAction] = useState(null);
  const classes = useStyles();
  const day = initialDate.getDate();
  const month = initialDate.getMonth();
  const year = initialDate.getFullYear();
  const fullDate = month + 1 + "/" + day + "/" + year;

  const handleChange = (event, appointmentKey) => {
    let selectedAction = event.target.value;
    const appointmentsRef = db.collection("appointments");
    appointmentsRef
      .doc(appointmentKey)
      .update({ action: selectedAction })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  useEffect(() => {
    const appointmentsRef = db.collection("appointments");
    appointmentsRef.onSnapshot((snapshot) => {
      const appointments = snapshot.docs.map((doc) => {
        return { key: doc.id, ...doc.data() };
      });
      setAppointment(appointments.reverse());
    });
  }, []);

  const selectedDateAppointment = appointment.filter(
    (appointment) => appointment?.details?.date === fullDate
  );

  return (
    <div className="doctorsZone">
      <Sidebar></Sidebar>
      <div className="zoneAppointment">
        <div>
          <h4>Appointment</h4>
          <Calendar
            className="calender"
            selected={initialDate}
            onChange={(date) => setInitialDate(date)}
          ></Calendar>
        </div>
        {appointment[0] ? (
          <FullHeight>
            <div className="appointmentTable">
              <div className="tableHeading">
                <p>Appointment</p>
                <p>{fullDate}</p>
              </div>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="center">Schedule</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDateAppointment.map((appointment) => (
                      <TableRow key={appointment._id}>
                        <TableCell align="left">
                          {appointment.details.name}
                        </TableCell>
                        <TableCell align="center">
                          {appointment.details.time}
                        </TableCell>
                        <TableCell
                          onMouseOver={() => setKey(appointment.key)}
                          align="right"
                        >
                         <Select
  style={{ color: "white" }}
  className="actionSelect"
  value={appointment.action}
  defaultValue={appointment.action}
  onChange={(event) => handleChange(event, appointment.key)}
>
  <MenuItem value={"notVisited"}>Not Visited</MenuItem>
  <MenuItem value={"visited"}>Visited</MenuItem>
</Select>

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </FullHeight>
        ) : (
          <div
            style={{ margin: "400px 200px" }}
            className="spinner-border text-success"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsZone;
