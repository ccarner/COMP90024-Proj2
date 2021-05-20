import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { Container, Grid, Typography, Avatar, Button } from "@material-ui/core";

export default function Stats() {
  return (
    <Layout title="Cluster and Cloud Computing Project 2" description="COMP">
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
              <a>Graphs go here</a>
          </Container>
        </Grid>
      </Container>
    </Layout>
  );
}
