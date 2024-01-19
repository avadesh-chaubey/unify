import React from 'react';
import {
  Document,
  Page,
  Font,
  View,
  StyleSheet,
  Image
} from  "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell
} from "@david.kucsai/react-pdf-table";


Font.register({
  family: "Roboto",
  format: "truetype",
  src: '/fonts/Roboto-Bold.ttf' 
});

export default function CmsPdfList (props) {

  const docStyles = StyleSheet.create({
    page: {
      padding: 60,
    },
    heading: {
      display: 'flex',
      flexDirection: "row",
      width: "100%",
      color: "#fff",
      padding: "5px",
    },
    tableCell: {
      padding: 4,
      fontFamily: "Roboto",
      fontSize: 12
    },
    dataCell: {
      // padding: 4,
      paddingVertical: 7,
      paddingHorizontal: 4,
      fontSize: 10
    },
    imgHeading: {
      display: "flex",
      flexDirection: "row",
      float: "right",
      color: "#fff",
      position: "relative",
      bottom: 50,
      marginTop: 10
    },
    img: {
      width: 90,
      position: 'absolute',
      top: 0,
      right: -40,
    },
  });

  const { allblog } = props;

  return (
    <Document>
      {
        allblog !== undefined && allblog.length && allblog.map((blogArr, index) => {

          return (
            <Page style={docStyles.page} size="A4" key={index} wrap>
              <View style={docStyles.imgHeading} fixed>
                <Image source="/logo/home_page_logo.png" style={docStyles.img} />
              </View>
              <View>
                <Table style={docStyles.heading} data={ blogArr }>
                  <TableHeader>
                    <TableCell style={docStyles.tableCell}> Title </TableCell>
                    <TableCell style={docStyles.tableCell}> Publisher </TableCell>
                    <TableCell style={docStyles.tableCell}> Sorting </TableCell>
                    <TableCell style={docStyles.tableCell}> Category </TableCell>
                    <TableCell style={docStyles.tableCell}> Date </TableCell>
                    <TableCell style={docStyles.tableCell}> Status </TableCell>
                  </TableHeader>
                  <TableBody>
                    <DataTableCell style={docStyles.dataCell} getContent={(r) => r.title} />
                    <DataTableCell style={docStyles.dataCell} getContent={(r) => r.publisher} />
                    <DataTableCell style={docStyles.dataCell} getContent={(r) => r.sorting} />
                    <DataTableCell style={docStyles.dataCell} getContent={(r) => r.categories} />
                    <DataTableCell style={docStyles.dataCell} getContent={(r) => r.modifiedPublishedDate} />
                    <DataTableCell style={docStyles.dataCell} getContent={(r) => r.status} />
                  </TableBody>
                </Table>
              </View>
            </Page>
          );
        })
      }
    </Document>
  )
}
