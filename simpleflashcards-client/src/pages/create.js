import React, { Component } from "react";
import DeckTable from "../components/DeckTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  Divider,
  Card,
  CardContent,
  TextField,
  Box,
  Button
} from "@material-ui/core";
import Photo from "@material-ui/icons/Photo";

export class create extends Component {
  render() {
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={10} lg={10} xl={10}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h4">Create new deck</Typography>
                <Divider></Divider>
                <br />
                <Grid container>
                  <Grid item sm={10} lg={10} xl={10} container direction="row">
                    <Grid>
                      <Card
                        style={{
                          width: "110px",
                          height: "130px",
                          marginRight: "20px"
                        }}
                      >
                        <CardContent>
                          <Typography
                            style={{ textAlign: "center" }}
                            variant="body2"
                          >
                            <Photo></Photo>
                            CHOOSE COVER (OPTIONAL)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid>
                      <Box style={{ marginBottom: "10px" }}>
                        <TextField
                          variant="outlined"
                          label="Enter Title"
                        ></TextField>
                      </Box>
                      <Box>
                        <TextField
                          variant="outlined"
                          label="Enter Description (optional)"
                        ></TextField>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    lg={2}
                    xl={2}
                    container
                    justify="flex-end"
                    alignItems="flex-start"
                  >
                    <Button size="large" color="secondary" variant="contained">
                      Create
                    </Button>
                  </Grid>
                </Grid>
                <br />
                <DeckTable></DeckTable>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default create;
