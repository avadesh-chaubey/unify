import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#E0EEFF",
    color: "#000000",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  // root: {
  //   "&:nth-of-type(odd)": {
  //     backgroundColor: theme.palette.action.hover,
  //   },
  // },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  tableContainerscroll: {
    "&.MuiTableContainer-root": {
      overflow: "hidden !important",
    },
  },
});
export default function PrescriptionTable(props) {
  const classes = useStyles();
  const { PrescriptionListData } = props;
  // console.log("=====>doctorDetails11", data);

  return (
    <>
      <div>
        <TableContainer
          component={Paper}
          className={classes.tableContainerscroll}
        >
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>DRUG TYPE</StyledTableCell>
                <StyledTableCell align="center">DRUG NAME</StyledTableCell>
                <StyledTableCell align="center">
                  DOSE/RELATION TO FOOD
                </StyledTableCell>
                <StyledTableCell align="center">COMMENTS</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PrescriptionListData &&
                PrescriptionListData.tableList.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.SNo}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.drugType}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.drugName}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.dose}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.comment}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
