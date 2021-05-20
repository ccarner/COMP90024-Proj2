import React from "react";
import Typography from "@material-ui/core/Typography";
import Copyright from "./Copyright";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    width: `100%`,
    position: "relative",
    overflow: "hidden",
    // marginTop: "6em",
    padding: "2em 0 ",
  },
  link: {
    fontSize: "1.25em",
    color: "#fff",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  copyright: {
    color: "#fff",
    align: "center",
    fontSize: "1em",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
}));

function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Typography
        className={classes.copyright}
        variant="subtitle1"
        align="center"
      >
        bingx1 - mamarik - ccarner - blulham
      </Typography>
      <Copyright className={classes.copyright} />
    </footer>
  );
}

export default Footer;
