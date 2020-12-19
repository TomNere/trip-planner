import { connect, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import { RootState, store } from "../redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { CardActions, makeStyles, Paper, TextareaAutosize } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useFirestore } from "react-redux-firebase";
import { reinitializeWeather, setRightPanelContext, setWeatherLocation } from "../redux/actions";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import CloudIcon from "@material-ui/icons/Cloud";
import { IWindowSize, useWindowSize } from "../hooks/useWindowSize";
import { isMobileMode } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  notchedOutline: {
    borderColor: theme.palette.primary.dark,
  },
  input: {
    backgroundColor: "#ffffffad",
  },
  button: {
    marginLeft: "2px",
    marginRight: "2px",
    width: (windowSize: IWindowSize) => (windowSize?.width !== undefined && windowSize?.width > 800 ? "calc(55% - 4px)" : "calc(100% - 12px)"),
  },
  paper: {
    backgroundColor: "#ffffffad",
    marginBottom: "5px",
  },
  areaTitle: {
    color: theme.palette.primary.dark,
  },

  emptyText: {
    marginTop: "40%",
  },
}));

const mapStateToProps = ({ areas }: RootState) => {
  return { areas };
};

interface PlanTripInterface {
  onClose: () => void;
}

type PlanTripProps = ReturnType<typeof mapStateToProps> & PlanTripInterface;

const PlanTrip: React.FC<PlanTripProps> = ({ areas, onClose }) => {
  const [name, setName] = useState<string>("My Trip");
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState<string>("I should take some beers...");

  const history = useHistory();
  const firestore = useFirestore();
  const { uid } = useSelector((state: RootState) => state.firebase.auth);

  const windowSize = useWindowSize();
  const mobileOn = isMobileMode(windowSize);
  const classes = useStyles(windowSize);

  const onDateChange = (date: Date | null) => {
    setDate(date ?? new Date());
  };

  const onNameChange = (e: any) => {
    setName(e.target.value);
  };

  const onNoteChange = (e: any) => {
    setNote(e.target.value);
  };

  const openWeather = () => {
    store.dispatch(reinitializeWeather(true));
    store.dispatch(setRightPanelContext("weather", true));
  };

  const submit = () => {
    const area = areas.clickedArea;

    if (!area) {
      return;
    }

    firestore
      .collection("users")
      .doc(uid)
      .collection("trips")
      .add({
        areaId: area.id,
        areaName: area.name,
        position: area.position,
        name,
        date,
        notes: [note],
      })
      .then((docRef) => {
        docRef.update({
          id: docRef.id,
        });
      })
      .then(() => history.push("/"));
  };

  return (
    <>
      <Card style={{ height: "100%", opacity: areas.clickedArea ? 1 : 0.7 }}>
        {areas.clickedArea ? (
          <>
            <CardContent>
              <Paper className={classes.paper}>
                <Typography color="secondary" variant="h6" component="h1">
                  Plan your trip to:
                </Typography>
              </Paper>

              <Typography className={classes.areaTitle} color="secondary" variant="h5">
                {areas.clickedArea.name}
              </Typography>
              <TextField
                InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={name}
                onChange={onNameChange}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  margin="normal"
                  inputVariant="outlined"
                  id="date-picker-dialog"
                  label="Date picker dialog"
                  format="MM/dd/yyyy"
                  value={date}
                  onChange={onDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
                variant="outlined"
                id="standard-multiline-flexible"
                label="Note"
                multiline
                fullWidth
                rowsMax={4}
                value={note}
                onChange={onNoteChange}
              />
            </CardContent>
            <CardActions disableSpacing>
              {mobileOn && (
                <Button className={classes.button} color="secondary" variant="outlined" startIcon={<CloseIcon />} onClick={onClose}>
                  Close
                </Button>
              )}
              <Button className={classes.button} color="secondary" variant="outlined" startIcon={<DoneIcon />} onClick={submit}>
                Submit
              </Button>
              <Button className={classes.button} color="primary" variant="outlined" startIcon={<CloudIcon />} onClick={openWeather}>
                Weather
              </Button>
            </CardActions>
          </>
        ) : (
          <Typography className={classes.emptyText} color="secondary" variant="h6">
            Select the area
          </Typography>
        )}
      </Card>
    </>
  );
};

export default connect(mapStateToProps)(PlanTrip);