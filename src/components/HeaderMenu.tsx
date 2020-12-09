import { AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import React, { useState } from "react";
import { IWindowSize, useWindowSize } from "../hooks/useWindowSize";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { useFirebase } from "react-redux-firebase";
import logo from "../assets/png/Logo2.png";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "transparent",
    boxShadow: "none",
  },
  login: {
    background: "transparent",
    "&:hover": {
      //background: "transparent",
      //color: "white",
    },
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  link: { textDecoration: "none", color: theme.palette.secondary.dark },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  drawer: {
    width: (drawerSize: IWindowSize) => drawerSize.width,
  },
  drawerPaper: {
    width: (drawerSize: IWindowSize) => drawerSize.width,
  },
}));

export const HeaderMenu: React.FC = (props) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const windowSize = useWindowSize();
  const drawerSize = {
    width: windowSize.width != undefined && windowSize.width > 500 ? 300 : windowSize.width,
    //height: windowSize.height != undefined && windowSize.height > 500 ? 300 : windowSize.height,
  };
  const classes = useStyles(drawerSize);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const { uid } = useSelector((state: RootState) => state.firebase.auth);

  const firebase = useFirebase();

  // Sign out handler
  const signOut = () => firebase.auth().signOut();

  return (
    <>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Link className={classes.link} to={uid ? "/" : "/login"}>
            <Button className={classes.login} color="secondary" startIcon={<PersonIcon />} onClick={() => uid && signOut()}>
              {uid ? "Logout" : "Login"}
            </Button>
          </Link>
          <div className={classes.title}></div>
          <IconButton color="secondary" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        {/* TODO napisat lepsie */}
        <List>
          <Link className={classes.link} to="/">
            <ListItem button key={1}>
              <ListItemText primary={"Home"} />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/map">
            <ListItem button key={2}>
              <ListItemText primary={"Map"} />
            </ListItem>
          </Link>
          {uid && (
            <Link className={classes.link} to="/trips">
              <ListItem button key={3}>
                <ListItemText primary={"Trips"} />
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>
    </>
  );
};
