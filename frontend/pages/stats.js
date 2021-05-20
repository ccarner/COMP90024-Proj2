import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { Container, Grid, Typography, Avatar, Button, makeStyles } from "@material-ui/core";
import LineChart from "../components/Chart";

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: `5em`,
    [theme.breakpoints.down("md")]: {
      marginBottom: "4em",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "2em",
    },
  },
}));

export default function Stats() {


  const classes = useStyles();

  return (
    <Layout title="Cluster and Cloud Computing Project 2" description="COMP">
      <div className={classes.toolbarMargin} />

      <Container maxWidth="md">
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          style={{ marginBottom: "1em" }}
        >
          Data Analysis
        </Typography>
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={4}
        ></Grid>
        <Grid item>
          <Container maxWidth="sm">
              <LineChart/>
          </Container>
        </Grid>
      </Container>
    </Layout>
  );
}
