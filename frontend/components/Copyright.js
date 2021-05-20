import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  copyright: {
    color: "#fff",
    align: 'center',
    fontSize: "1em",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  link: {
    fontSize: "1.00em",
    color: "#fff",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
}));

export default function Copyright() {
  const styles = useStyles();
  return (
    <Typography className={styles.copyright} align='center'>
      {"Copyright © "} {new Date().getFullYear()}
      {".  "}
      <Link className={styles.link} href="https://github.com/ccarner/COMP90024-Proj2">
        GitHub
      </Link>
    </Typography>
  );
}