import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import time from "../../data/time.json";

function createData(name) {
  return { name };
}

const rows = [
  createData('Cupcake'),
  createData('Donut'),
  createData('Eclair'),
  createData('Frozen yoghurt'),
  createData('Gingerbread'),
  createData('Honeycomb'),
  createData('Ice cream sandwich'),
  createData('Jelly Bean'),
  createData('KitKat'),
  createData('Lollipop'),
  createData('Marshmallow'),
  createData('Nougat'),
  createData('Oreo'),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, label: "Patient" },
  { id: 'date', numeric: false, label: "Booked Date" },
  { id: 'time', numeric: false, label: "Booked Time" },
  { id: 'phno', numeric: false, label: "Ph No" },
  { id: 'doctor', numeric: false, label: "Doctor" },
];

function EnhancedTableHead(props) {
  const { selectedEmp } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding="default"
          >
            {(selectedEmp.userType !== 'physician:assistant' && headCell.id === 'doctor' )
              ? 'Assistant'
              : headCell.label
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowY: 'auto',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 518,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function AppointmentTableView(props) {
  const { list, selectedEmp } = props;
  // const list2 = list.map(i => i.consultantName = 'Kris');
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const getAppTime = (slotId) => {
    const getTime = time.filter(t => t.value === slotId);

    return getTime[0].label;
  }

  return (
    <div className={classes.root}>
      <Paper className={`${classes.paper}`}>
        <TableContainer className="assistant-table-paper">
          <Table
            className={classes.table}
            aria-labelledby="assistant-table"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={list.length}
              selectedEmp={selectedEmp}
            />
            <TableBody>
              {stableSort(list, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      className="assistant-table-row"
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="default">
                        {row.customerName}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="default">
                        {row.appointmentDate}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="default">
                        {getAppTime(row.appointmentSlotId)}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="default">
                        {row.parentPhoneNumber}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="default">
                        {`${
                          selectedEmp.userType !== 'physician:assistant' 
                            ? row.assistantName
                            : (
                                (row.consultantName === undefined || row.consultantName === '')
                                  ? '-'
                                  : row.consultantName
                              )
                          }`
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
