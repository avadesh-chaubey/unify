import Router from 'next/router';
import Link from 'next/link';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import axios from 'axios';

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

const PartnerHomePage = ({ currentUser, employees }) => {

   const classes = useStyles();

   const newEmployeeHandler = () => {
      Router.push('/employee/new-employee');
   };
   const signout = async () => {
      await axios.post('/api/users/signout')
         .then(() => {
            Router.push('/')
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
            onClick={() => newEmployeeHandler()}
            variant="contained"
            color="secondary"
            className="primary-button forward"
            style={{ margin: "20px 20px 20px 50px" }}
         >
            Add New Employee
            <Icon className="fa fa-chevron-right"></Icon>
         </Button>
      </div>
      <div className={classes.root}>
         <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell>Registered Employees</TableCell>
                     <TableCell align="right">Role</TableCell>
                     <TableCell align="right">Department</TableCell>
                     <TableCell align="right">Link</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {employees.map((employee) => (
                     <TableRow key={employee.id}>
                        <TableCell component="th" scope="row">
                           {employee.userFirstName}
                        </TableCell>
                        <TableCell align="right">{employee.userType}</TableCell>
                        <TableCell align="right">{employee.department}</TableCell>
                        <TableCell align="right"><Link href="/employee/[employeeId]" as={`/employee/${employee.id}`}>
                           <a>View</a>
                        </Link></TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   </>
};

PartnerHomePage.getInitialProps = async (context, client, currentUser) => {
   const { data } = await client.get('/api/partner/employee');

   return { employees: data };
};

export default PartnerHomePage;
