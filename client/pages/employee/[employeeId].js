import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';


const useStyles = makeStyles({
  table: {
    width: 1200,
  },
  root: {
    width: 1300,
    height: 800,
    margin: 50
  },
});

const EmployeeShow = ({ currentUser, employee }) => {

  const classes = useStyles();
  const router = useRouter();

  const newInviteHandler = async () => {
    await axios.post(`/api/partner/resendinvite`, { employeeId: employee.id })
      .then(() => {
        console.log("Invite sent Successfully");
      })
      .catch(error => {
        console.log(error);
      });
  }

  const signout = async () => {
    await axios.post('/api/users/signout')
      .then(() => {
        router.push('/')
      })
      .catch(error => {
        console.log(error);
        alert.show('API error', { type: 'error' })
      });
  }

  return <>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: "#2b2b2b",
      }}
    >
      <Button
        size="small"
        variant="contained"
        color="secondary"
        className="primary-button"
        onClick={signout}
        style={{ margin: "20px 20px 20px 1250px" }}
      >
        Logout
          </Button>
    </div>
    <div>
      <Button
        size="small"
        onClick={() => newInviteHandler()}
        variant="contained"
        color="secondary"
        className="primary-button forward"
        style={{ margin: "20px 20px 20px 50px" }}
      >
        Resend Invite
            <Icon className="fa fa-chevron-right"></Icon>
      </Button>
    </div>
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Department</TableCell>
              <TableCell align="right">ExperinceInYears</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={employee.id}>
              <TableCell component="th" scope="row">
                {employee.userFirstName}
              </TableCell>
              <TableCell align="right">{employee.emailId}</TableCell>
              <TableCell align="right">{employee.phoneNumber}</TableCell>
              <TableCell align="right">{employee.userType}</TableCell>
              <TableCell align="right">{employee.department}</TableCell>
              <TableCell align="right">{employee.experinceInYears}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  </>
};

EmployeeShow.getInitialProps = async (context, client) => {
  const { employeeId } = context.query;
  const { data } = await client.get(`/api/partner/employee/${employeeId}`);

  return { employee: data };
};

export default EmployeeShow;

