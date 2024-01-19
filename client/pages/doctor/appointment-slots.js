import React, { useState, useMemo, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { useRouter } from 'next/router';
import axios from 'axios';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        margin: '50px',
    },
    paper: {
        padding: '5px',
        textAlign: 'center',
    },
    text: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: '50px',
    },
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00e676',
        },
        secondary: {
            main: grey[100],
        },
    },
});

const FullWidthGrid = () => {

    const classes = useStyles();
    const router = useRouter();

    const { appointmentDate, consultantId, availableSlotList } = router.query;
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [isSameDate, setIsSameDate] = useState(moment(appointmentDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD')));
    const [currentActiveSlot, setCurrentActiveSlot] = useState(((moment().utcOffset(330).toObject()).hours * 2 + ((moment().utcOffset(330).toObject()).minutes > 30 ? 2 : 1)) + 1);

    const selectedSlotsTemp = [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
    ];

    useEffect(() => {
        let num = null;
        if (availableSlotList && availableSlotList.length == 2) {
            selectedSlotsTemp[availableSlotList[1]] = true
        } else if (availableSlotList && availableSlotList.length > 2) {
            num = availableSlotList.map(Number);
            num.splice(0, 1);
        }

        if (num != null && num.length > 1) {
            for (var i = 0; i < num.length; i++) {
                selectedSlotsTemp[num[i]] = true;
            }
        }
        setSelectedSlots(selectedSlotsTemp);
    }, [])

    const handleClick = (index) => {
        const newSelectedSlots = [...selectedSlots];
        newSelectedSlots[index] = !newSelectedSlots[index];
        setSelectedSlots(newSelectedSlots);
    }

    const handleSubmit = async () => {
        console.log(selectedSlots);
        try {
            await axios.post(`/api/appointment/updateslots`, {
                consultantId: consultantId,
                appointmentDate: appointmentDate,
                availableSlotList: selectedSlots
            }).then((response) => {
                console.log(response.data);
                router.push(`/doctor/${consultantId}`)
            }).catch(error => {
                console.log(error);
                alert.show('API error', { type: 'error' })
            });
        } catch (error) {
            throw error;
        }
    }

    const goBack = async () => {
        router.push(`/doctor/${consultantId}`);
    }

    return <>
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                background: "#2b2b2b",
            }}>
            <Button
                size="small"
                variant="contained"
                color="secondary"
                className="primary-button"
                onClick={goBack}
                style={{ margin: "20px 20px 20px 1250px" }}>
                Back
            </Button>
        </div>
        <ThemeProvider theme={theme}>
            <TextField
                id="date"
                type="date"
                value={appointmentDate}
                className={classes.text}
                disabled
                onChange={(e) => setAppointmentDate(e.target.value)}
            />
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 17)) ? true : false}
                                color={selectedSlots[16] ? "primary" : "secondary"}
                                onClick={() => handleClick(16)}>
                                8:00 - 8:30 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 18)) ? true : false}
                                color={selectedSlots[17] ? "primary" : "secondary"}
                                onClick={() => handleClick(17)}>
                                8:30 - 9:00 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 19)) ? true : false}
                                color={selectedSlots[18] ? "primary" : "secondary"}
                                onClick={() => handleClick(18)}>
                                9:00 - 9:30 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 20)) ? true : false}
                                color={selectedSlots[19] ? "primary" : "secondary"}
                                onClick={() => handleClick(19)}>
                                9:30 - 10:00 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 21)) ? true : false}
                                color={selectedSlots[20] ? "primary" : "secondary"}
                                onClick={() => handleClick(20)}>
                                10:00 - 10:30 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 22)) ? true : false}
                                color={selectedSlots[21] ? "primary" : "secondary"}
                                onClick={() => handleClick(21)}>
                                10:30 - 11:00 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 23)) ? true : false}
                                color={selectedSlots[22] ? "primary" : "secondary"}
                                onClick={() => handleClick(22)}>
                                11:00 - 11:30 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 24)) ? true : false}
                                color={selectedSlots[23] ? "primary" : "secondary"}
                                onClick={() => handleClick(23)}>
                                11:30 - 12:00 AM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 25)) ? true : false}
                                color={selectedSlots[24] ? "primary" : "secondary"}
                                onClick={() => handleClick(24)}>
                                12:00 - 12:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 26)) ? true : false}
                                color={selectedSlots[25] ? "primary" : "secondary"}
                                onClick={() => handleClick(25)}>
                                12:30 - 1:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 27)) ? true : false}
                                color={selectedSlots[26] ? "primary" : "secondary"}
                                onClick={() => handleClick(26)}>
                                1:00 - 1:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 28)) ? true : false}
                                color={selectedSlots[27] ? "primary" : "secondary"}
                                onClick={() => handleClick(27)}>
                                1:30 - 2:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 29)) ? true : false}
                                color={selectedSlots[28] ? "primary" : "secondary"}
                                onClick={() => handleClick(28)}>
                                2:00 - 2:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 30)) ? true : false}
                                color={selectedSlots[29] ? "primary" : "secondary"}
                                onClick={() => handleClick(29)}>
                                2:30 - 3:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 31)) ? true : false}
                                color={selectedSlots[30] ? "primary" : "secondary"}
                                onClick={() => handleClick(30)}>
                                3:00 - 3:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 32)) ? true : false}
                                color={selectedSlots[31] ? "primary" : "secondary"}
                                onClick={() => handleClick(31)}>
                                3:30 - 4:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 33)) ? true : false}
                                color={selectedSlots[32] ? "primary" : "secondary"}
                                onClick={() => handleClick(32)}>
                                4:00 - 4:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 34)) ? true : false}
                                color={selectedSlots[33] ? "primary" : "secondary"}
                                onClick={() => handleClick(33)}>
                                4:30 - 5:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 35)) ? true : false}
                                color={selectedSlots[34] ? "primary" : "secondary"}
                                onClick={() => handleClick(34)}>
                                5:00 - 5:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 36)) ? true : false}
                                color={selectedSlots[35] ? "primary" : "secondary"}
                                onClick={() => handleClick(35)}>
                                5:30 - 6:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 37)) ? true : false}
                                color={selectedSlots[36] ? "primary" : "secondary"}
                                onClick={() => handleClick(36)}>
                                6:00 - 6:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 38)) ? true : false}
                                color={selectedSlots[37] ? "primary" : "secondary"}
                                onClick={() => handleClick(37)}>
                                6:30 - 7:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 39)) ? true : false}
                                color={selectedSlots[38] ? "primary" : "secondary"}
                                onClick={() => handleClick(38)}>
                                7:00 - 7:30 PM
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Paper className={classes.paper}>
                            <Button
                                variant="contained"
                                disabled={(isSameDate && (currentActiveSlot > 40)) ? true : false}
                                color={selectedSlots[39] ? "primary" : "secondary"}
                                onClick={() => handleClick(39)}>
                                7:30 - 8:00 PM
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    className={classes.text}
                    color="primary"
                    onClick={handleSubmit}>
                    Submit
                </Button>
            </div>

        </ThemeProvider>
    </>
}

export default FullWidthGrid;
