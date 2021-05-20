import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  snsIcon: {
    width: "30px",
    height: "30px",

    [theme.breakpoints.down("xs")]: {
      width: "25px",
      height: "25px",
    },
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
}));

const Social = ({ color }) => {
  const classes = useStyles();

  return (
    <Grid item container spacing={2} justify="center">
      <Grid
        item
        component={"a"}
        target="_blank"
        rel="noreferrer noopener"
        href="https://github.com/ccarner/COMP90024-Proj2"
      >
        <GitHubIcon
          className={classes.snsIcon}
          color={color ? "primary" : "secondary"}
        />
      </Grid>
    </Grid>
  );
};

export default Social;