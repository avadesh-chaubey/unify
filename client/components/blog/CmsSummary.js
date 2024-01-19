import React, { useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

export default function CmsSummary(summary) {
  useEffect(() => {
    // console.log(summary.summaryData);
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    card: {
      width: "130px",
      height: "130px",
      borderRadius: "5px",
      textAlign: "center",
    },
    typotext: {
      color: "#161616",
      fontSize: "22px",
    },
    typotext2: {
      paddingTop: "0",
      color: "#979797",
      fontWeight: "normal",
      fontSize: "20px",
    },
    img: {
      width: "40px",
      height: "40px",
    },
    heading: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: "#7F368C",
      width: "100%",
      height: "50px !important",
      color: "#fff",
      padding: "5px",
      paddingLeft: "20px",
    },
    headingTitle: {
      float: "right",
      marginTop: "6px",
      fontSize: "26px",
      marginLeft: "20px",
      fontWeight: "semibold",
    },
  });

  const getUnpublish = (group) => {
    var count = 0;
    if (summary.summaryData.length > 0) {
      for (var i = 0; i < summary.summaryData.length; i++) {
        if (summary.summaryData[i].status == "Unpublished") {
          count++;
        }
      }
      return count;
    } else {
      return (count = 0);
    }
  };

  const getPublish = (group) => {
    var publish = 0;
    if (summary.summaryData.length > 0) {
      for (var j = 0; j < summary.summaryData.length; j++) {
        if (summary.summaryData[j].status == "Published") {
          publish++;
        }
      }
      return publish;
    } else {
      return (publish = 0);
    }
  };

  return (
    <Document>
      <Page size="A4">
        <View style={styles.heading}>
          <Image source="/logo/admin_logo.png" style={styles.img} />
          <Text style={styles.headingTitle}>Content Management Summary</Text>
        </View>
        <View style={styles.page}>
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.typotext}>Total Blogs</Text>
              <Text style={styles.typotext2}>
                {summary.summaryData.length > 0
                  ? summary.summaryData.length
                  : "0"}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.typotext}>Published</Text>
              <Text style={styles.typotext2}>{getPublish(1)}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.typotext}>UnPublished</Text>
              <Text style={styles.typotext2}>{getUnpublish(1)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
