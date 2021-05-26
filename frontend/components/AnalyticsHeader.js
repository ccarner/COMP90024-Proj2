/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import Link from "./Link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {Grid,AppBar,Toolbar,Typography,List,ListItem,ListItemText,SwipeableDrawer,IconButton} from "@material-ui/core";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import MenuIcon from "@material-ui/icons/Menu";
import { routes } from "../data/routes";

const sections = [
    { title: 'All States', url: '/analytics'},
    { title: 'Melbourne', url: '/analytics/melbourne'},
    { title: 'Sydney', url: '/analytics/sydney'},
    { title: 'Brisbane', url: '/analytics/brisbane'},
    { title: 'Perth', url: '/analytics/perth'},
    { title: 'Adelaide', url: '/analytics/adelaide'},
  ];
  
function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 2,
  });
}

const useStyles = makeStyles((theme) => ({
  logo: {
    color: theme.palette.secondary.main,
    width: "max-content",
    fontSize: "1.5rem",
  },
  drawerIconContainer: {
    marginLeft: "auto",
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  drawerIcon: {
    height: `50px`,
    width: `50px`,
    color: `#fff`,
    [theme.breakpoints.down("xs")]: {
      height: `40px`,
      width: `40px`,
    },
  },
  drawer: {
    backgroundColor: theme.palette.secondary.main,
    padding: "0 6em",
  },
  toolbar:{
    maxWidth: "1280px",
    margin: "0 auto",
    width: "100%",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
    backgroundColor: "#2E3138",
    // opacity: 0.9,
  },
  link: {
    fontSize: "1.25em",
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  toolbarLink: {
    padding: theme.spacing(1),
    color: theme.palette.secondary.main,
    flexShrink: 0,
    // "&:hover": {
    //   color: theme.palette.info.main,
    // },
  },
}));

const AnalyticsHeader = ({cityName}) => {
  const classes = useStyles();
  const theme = useTheme();
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDrawer, setOpenDrawer] = useState(false);

  const router = useRouter();

  const path = routes;

  const tabs = (
    <>
      <Grid container justify="flex-end" spacing={4}>
        {path.map(({ name, link }) => (
          <Grid item key={link}>
            <Link href={link}>
              <Typography
                className={classes.link}
                style={{
                  fontWeight: router.pathname === link && "bold",
                  borderBottom: router.pathname === link && "1px solid #757ce8",
                }}
              >
                {name}
              </Typography>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const drawer = (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        classes={{ paper: classes.drawer }}
        anchor="right"
      >
        <div className={classes.toolbarMargin} />
        <List disablePadding>
          {path.map(({ name, link }) => (
            <ListItem
              key={link}
              divider
              button
              onClick={() => {
                setOpenDrawer(false);
              }}
            >
              <ListItemText disableTypography>
                <Link href={link}>
                  <Typography
                    style={{
                      color:
                        router.pathname === link
                          ? "primary"
                          : "rgb(107 107 107)",
                      fontWeight: router.pathname === link && "bold",
                    }}
                  >
                    {name}
                  </Typography>
                </Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
        className={classes.drawerIconContainer}
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </>
  );

  return (
    <>
      <ElevationScroll>
        <AppBar className={classes.appBar}>
          <Toolbar disableGutters className={classes.toolbar} style={{padding: matches ? "0 16px" : "24px",}}>
            <Link href="/">
              <Typography className={classes.logo}>Cluster and Cloud Computing Project 2</Typography>
            </Link>
            {matches ? drawer : tabs}
          </Toolbar>
          <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
            {sections.map((section) => (
            <Link
                noWrap
                key={section.title}
                href={section.url}
                className={classes.toolbarLink}
            >
              <Typography style = {{color: cityName === section.title ?"inherit":"6C6F7D", fontWeight: cityName === section.title && "bold",}}>
                {section.title}
              </Typography>
            </Link>
            ))}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </>
  );
};
export default AnalyticsHeader;