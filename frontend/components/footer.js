import React from "react";
import Typography from "@material-ui/core/Typography";
import Copyright from "./copyright";

function Footer() {
  return (
    <footer>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        bingx1 - mamarik - ccarner
      </Typography>
      <Copyright />
    </footer>
  );
}

export default Footer;
