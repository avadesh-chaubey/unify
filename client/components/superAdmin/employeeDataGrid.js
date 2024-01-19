import React, { useState, useEffect } from "react";
import moment from "moment";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles, Tooltip, Link } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import config from '../../app.constant';
import ConfirmationDialog from './confirmationDialog';

const useStyles = makeStyles((theme) => ({
  blogGrid: {
    fontFamily: "Bahnschrift SemiBold",
    border: "none",

    "& .MuiDataGrid-cell": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
      textAlign: "left",
      color: "#555555",
    },
    "& .MuiDataGrid-columnHeaderTitleContainer": {
      padding: 'unset',
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontFamily: "Bahnschrift SemiBold",
      color: "#000000",
      overFlow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "inherit",
      fontSize: '15px',
      fontWeight: 600,
    },
    "& .MuiTablePagination-actions": {
      display: "none",
    },
    "& .makeStyles-caption-34[id]": {
      display: "none",
    },
    "& .makeStyles-input-35": {
      display: "none",
    },
    "& .MuiTablePagination-caption": {
      display: "none",
    },
    "& .MuiDataGrid-footerContainer": {
      display: "none",
    },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-menuIcon": {
      display: "none",
    },
    "& .MuiDataGrid-window": {
      overflowX: 'hidden'
    }
  },
}));

export default function EmployeeDataGrid (props) {
  const { blogList, setMsgData } = props;
  const classes = useStyles();
  const [listData, setListData] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  
  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem("userDetails")));
  }, []);

  useEffect(() => {
    if (blogList.length) {
      const updateBlogList = blogList.map((data, index) => {
        if (data.id === undefined) {
          data.id = index + 1;
        }
        return data;
      });

      // Remove logged in user id from user access list
      const removeSelfEmailId = updateBlogList.filter(data => data.email !== userDetails.emailId);
      setListData(removeSelfEmailId);
    }
  }, [blogList]);

  // Function to Activate / Deactivate user
  const handleAction = (e, data) => {
    e.preventDefault();

    let tempData = [...listData];
    tempData.map((item)=>{
      if(item.id === data.row.id && item.email === data.row.email){
        const headers = {
          authtoken: JSON.parse(localStorage.getItem('token'))
        };

        let objData = {
          emailId : data.row.emailId,
          userStatus : data.row.userStatus !== 'active' ? 'active' : 'inactive'
        };

        axios.put(`${config.API_URL}/api/users/updateuserstatus`, objData, { headers })
          .then(res => {
            // Update userStatus after successful api update
            item.userStatus = res.data.data.userStatus;
            setMsgData({ 
              message: "Updated User Status Successfully",
              type:"success"
            });
            setOpenDialog(false);
            setSelectedUser('');
            setListData(tempData);
          })
          .catch(err => {
            setOpenDialog(false);
            setMsgData({
              message: !!err.response
                ? err.response.data[0].message
                : "Error occurred while updating status",
              type: "error"
            });
          });
      }
    })
  };

  // Function to update User Status on clicking the switch
  const handleStatusClick = (e, user) => {
    e.preventDefault();
    setOpenDialog(prevState => !prevState);
    setSelectedUser(user);
  };
  
  const columns = [
    {
      field: "id",
      headerName: "ID",
      // hide: true,
      width: 80,
      height: 50,
      // renderCell: (params, id) => <div>{params.id.substr(-4)}</div>,
    },
    {
      field: "Employee Name",
      headerName: "Employee Name",
      width: 180,
      height: 50,
      renderCell: (params) => (
        <Tooltip title={`${params.row.userFirstName} ${params.row.userLastName}`} placement="right-start">
          <div className="triple-dot-email triple-text-dot">
            {`${params.row.userFirstName} ${params.row.userLastName}`}
          </div>
        </Tooltip>
      ),
      // valueGetter: (params) =>
      //   `${params.getValue(params.id, "userFirstName") || ""} ${
      //     params.getValue(params.id, "userLastName") || ""
      //   }`,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
      height: 50,
    },
    {
      field: "emailId",
      headerName: "Email",
      width: 190,
      height: 50,
      renderCell: (params) => (
        <Tooltip title={params.row.emailId} placement="right-start">
          <div className="triple-dot-email">
            {params.row.emailId}
          </div>
        </Tooltip>
      )
    },
    {
      field: "role",
      headerName: "Role Assigned",
      width: 140,
      height: 50,
      renderCell: (params) => (
        <Tooltip title={params.row.role} placement="right-start">
          <div className="triple-dot-role">
            {params.row.role}
          </div>
        </Tooltip>
      )
    },
    {
      field: "roleAssignedDate",
      headerName: "Assigned Date",
      width: 145,
      height: 50,
      renderCell: (params) => (
        <div style={{ fontWeight: 600, marginLeft: 7, lineHeight: "normal", color: "#55555" }}>
          <div className="date-font-color">
            {
              params.row.roleAssignedDate && params.row.roleAssignedDate !== ""
                ? moment(params.row.roleAssignedDate).format("DD MMM YYYY")
                : (
                    <div style={{ marginLeft: 35 }}>
                      -
                    </div>
                  )
            }
          </div>
          <div className="date-font-color">
            {
              params.row.roleAssignedDate && params.row.roleAssignedDate !== ""
                ? moment(params.row.roleAssignedDate).format("HH:mm:ss")
                : " "
            }
          </div>
        </div>
      ),
    },
    {
      field: "roleAssignedBy",
      headerName: "Assigned By",
      width: 135,
      height: 50,
    },
    {
      field: "isRoleActive",
      headerName: "Action",
      height: 50,
      width: 92,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Switch
              onClick={(e) => handleStatusClick(e, params)}
              checked={params.row.userStatus === 'active'}
              color="primary"
              name="Active"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
    {
      !!(selectedUser !== '') && (
        <ConfirmationDialog
          open={openDialog}
          handleAction={handleAction}
          setOpen={setOpenDialog}
          selectedUser={selectedUser}
        />
      )
    }

      <div className="cms-table-scrollbar employeeList">
        {blogList.length > 0 ? <DataGrid
          className={classes.blogGrid}
          rows={listData}
          columns={columns}
          pageSize={10}
          // rowsPerPageOptions={[10]}
          rowHeight={50}
          headerHeight={45}
          disableSelectionOnClick
        /> :
        <div style={{textAlign:"center", paddingTop:"20%"}}>
          No Data To Show
        </div>
      
      }
      </div>
    </>
  );
}
