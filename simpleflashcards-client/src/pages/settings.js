import React, { Component } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Lock from "@material-ui/icons/Lock";
import Person from "@material-ui/icons/Person";
import Mail from "@material-ui/icons/Mail";
import Notes from "@material-ui/icons/Notes";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import Input from "@material-ui/core/Input";

export class settings extends Component {
  render() {
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={6} lg={6} xl={6}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h5">Settings</Typography>
                <Divider></Divider>
                <br />
                <List
                  subheader={<ListSubheader>Profile Settings</ListSubheader>}
                >
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          label="Username"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button color="secondary" variant="contained">
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Notes />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          label="Profile Description"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button color="secondary" variant="contained">
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <br />
                <List
                  subheader={<ListSubheader>Account Settings</ListSubheader>}
                >
                  <ListItem>
                    <ListItemIcon>
                      <Mail />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          label="Email"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button color="secondary" variant="contained">
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          type="password"
                          label="Password"
                          placeholder="••••••"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button color="secondary" variant="contained">
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <br />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default settings;
