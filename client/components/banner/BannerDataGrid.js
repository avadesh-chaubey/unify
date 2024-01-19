import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import config from "../../app.constant";
import { DataGrid } from "@material-ui/data-grid";
import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
  Link,
  Tooltip,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Switch,
} from "@material-ui/core";

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
    "& .MuiDataGrid-columnHeaderTitle": {
      fontFamily: "Bahnschrift SemiBold",
      color: "#000000",
      overFlow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "inherit",
      fontSize: "17px",
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
      overflowX: "hidden",
    },
    "& .Mui-odd:hover, .Mui-even:hover": {
      backgroundColor: "rgb(169 217 252 / 53%)",
    },
    "& .MuiDataGrid-overlay": {
      backgroundColor: "rgb(244 244 244 / 36%)",
    },
  },
}));

export default function BannerDataGrid(props) {
  const {
    blogList,
    tableLoader,
    dataGridLoader,
    setDataGridLoader,
    fetchNewData,
    setFetchNewData,
    sortModel,
    setMsgData,
    setSortModel,
    handleSortModelChange,
  } = props;
  const classes = useStyles();
  const [listData, setListData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (blogList.length) {
      const updateBlogList = blogList.map((data, index) => {
        if (data.id === undefined) {
          data.id = index + 1;
        }
        console.log(data.action);
        return data;
      });
      setListData(updateBlogList);
    }
  }, [blogList]);

  // Function to Activate / Deactivate user
  const handleAction = (e, data) => {
    e.preventDefault();

    let tempData = [...listData];
    tempData.map((item) => {
      if (item.blogId === data.row.blogId) {
        const headers = {
          authtoken: JSON.parse(localStorage.getItem("token")),
        };

        let objData = {
          blogId: data.row.blogId,
          action: data.row.action === false ? true : false,
        };

        axios
          .put(`${config.API_URL}/api/cms/updateblogstatus`, objData, {
            headers,
          })
          .then((res) => {
            // Update userStatus after successful api update
            item.action = res.data.data.action;
            setMsgData({
              message: "Action Updated Successfully",
              type: "success",
            });
            setOpenDialog(false);
            setSelectedUser("");
            setListData(tempData);
          })
          .catch((err) => {
            setOpenDialog(false);
            setMsgData({
              message: !!err.response
                ? err.response.data[0].message
                : "Error occurred while updating status",
              type: "error",
            });
          });
      }
    });
  };

  // Function to update Action to a blog on clicking the switch
  const handleStatusClick = (e, user) => {
    console.log(user);
    e.preventDefault();
    setOpenDialog((prevState) => !prevState);
    setSelectedUser(user);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "Blog Id",
      hide: true,
      width: 120,
    },
    {
      field: "title",
      headerName: "Title",
      width: 280,
      renderCell: (params) => (
        <div style={{ fontWeight: 600, marginLeft: 7 }}>{params.row.title}</div>
      ),
    },
    {
      field: "authorName",
      headerName: "Publisher",
      width: 130,
      renderCell: (params) => (
        <div style={{ fontWeight: 600, marginLeft: 7 }}>
          {params.row.authorName}
        </div>
      ),
    },
    {
      field: "sorting",
      headerName: "Sequence",
      width: 150,
      renderCell: (params) => (
        <div style={{ fontWeight: 600, marginLeft: 7 }}>
          {params.row.sorting}
        </div>
      ),
    },
    {
      field: "categories",
      headerName: "Category",
      width: 140,
      renderCell: (params) => (
        <div style={{ fontWeight: 600, marginLeft: 7 }}>
          <Tooltip
            className="category-tooltip"
            title={params.row.categories.join(", ")}
            placement="right-start"
            arrow
          >
            <div className="triple-dot-text">
              {params.row.categories.join(", ")}
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      field: "blogPublishedDate",
      headerName: "Date",
      width: 150,
      renderCell: (params) => (
        <div style={{ fontWeight: 600, marginLeft: 7, lineHeight: "normal" }}>
          <div>
            {params.row.publishedDate !== ""
              ? moment(params.row.publishedDate).format("DD MMM YYYY")
              : "-"}
            ,
          </div>
          <div>
            {params.row.publishedDate !== ""
              ? moment(params.row.publishedDate).format("HH:mm:ss")
              : "-"}
          </div>
        </div>
      ),
    },
    {
      field: "isPublished",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <div
          style={{ fontWeight: 600, marginLeft: 7 }}
          className={`${
            params.row.isPublished === "Published"
              ? "published-color"
              : "unpublished-color"
          }`}
        >
          {params.row.isPublished}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <IconButton>
              <Link href={`/cms/blogPost?blogId=${params.row.blogId}`}>
                <img src="/edit_icon.png" height="20" />
              </Link>
            </IconButton>
            {/* onClick={(e) => handleDeleteBlog(e, params.row.blogId)} */}
            <IconButton>
              <Link href={`/previewTemplate?blogId=${params.row.blogId}`}>
                <img src="/preview-blog-icon.svg" height="20" width="20" />
              </Link>
            </IconButton>
            <div>
              <Switch
                onClick={(e) => handleStatusClick(e, params)}
                checked={params.row.action === true ? true : false}
                color="primary"
                name="Active"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="cms-table-scrollbar">
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="warning-dialog"
        aria-describedby="warning-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Warning</DialogTitle>
        <DialogContent>
          <DialogContentText id="warning-dialog-description">
            Are you sure you want to{" "}
            {selectedUser?.row?.action === false ? "Activate" : "Deactivate"}{" "}
            {selectedUser?.row?.title} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="action-btn-no"
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            NO
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleAction(e, selectedUser)}
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
      {blogList.length ? (
        <DataGrid
          className={classes.blogGrid}
          rows={listData}
          loading={tableLoader}
          columns={columns}
          pageSize={12}
          rowHeight={50}
          headerHeight={45}
          disableSelectionOnClick
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          loading={dataGridLoader}
        />
      ) : (
        <TableContainer className="no-rec-table">
          <Table aria-label="oc-inventory-table">
            <TableBody>
              <TableRow className="blog-row-no-records">
                <TableCell>No records available</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
