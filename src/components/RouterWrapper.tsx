import React, { FC } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import HeaderMenu from "./HeaderMenu";
import { RootState } from "../redux";
import Home from "../pages/Home";
import Trips from "../pages/Trips";
import Notfound from "../pages/NotFound";
import Map from "../pages/Map";
import PlanTrip from "./PlanTrip";
import TripDetail from "../pages/TripDetail";
import { AreaType } from "../utils/types";
import { isValidAreaType } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  main: {
    textAlign: "center",
    //backgroundColor: "#2a0f3e30",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    flexGrow: 1,
  },
}));

const RouterWrapper: FC = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const classes = useStyles();

  const renderMapByAreaType = (areaType: AreaType) => {
    return isValidAreaType(areaType) ? <Map areaType={areaType} /> : <Notfound />;
  };

  return (
    <Router>
      <HeaderMenu />

      <main className={classes.main}>
        {/* Wait for user session */}
        {!isLoaded(auth) ? (
          <CircularProgress />
        ) : (
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/map/:areaType" exact render={({ match }) => renderMapByAreaType(match.params.areaType)} />
            <Route path="/trips" exact component={Trips} />
            <Route path="/plan-trip" exact component={PlanTrip} />
            <Route path="/trip-detail/:id" exact render={({ match }) => <TripDetail tripId={match.params.id} />} />
            <Route component={Notfound} />
          </Switch>
        )}
      </main>
    </Router>
  );
};

export default RouterWrapper;
