import React, { Component } from "react";
import axios from "axios";

import Account from "../components/account";
import Lists from "../components/list";
import ResponsiveDrawer from "../components/sidebar";

import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { authMiddleWare } from "../util/auth";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
});

class home extends Component {
  state = {
    render: false,
  };

  loadAccountPage = (event) => {
    this.setState({ render: true });
  };

  loadListPage = (event) => {
    this.setState({ render: false });
  };

  logoutHandler = (event) => {
    localStorage.removeItem("AuthToken");
    this.props.history.push("/login");
  };

  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      profilePicture: "",
      uiLoading: true,
      imageLoading: false,
    };
  }

  componentWillMount = () => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/user")
      .then((response) => {
        console.log(response.data);
        this.setState({
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          email: response.data.userCredentials.email,
          country: response.data.userCredentials.country,
          uiLoading: false,
        });
      })
      .catch((error) => {
        if (error.response.status === 403) {
          this.props.history.push("/login");
        }
        console.log(error);
        this.setState({ errorMsg: "Error in retrieving the data" });
      });
  };

  render() {
    const { classes } = this.props;
    if (this.state.uiLoading === true) {
      return (
        <div className={classes.root}>
          {this.state.uiLoading && (
            <CircularProgress size={150} className={classes.uiProgess} />
          )}
        </div>
      );
    } else {
      const drawerData = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        loadListPage: this.loadListPage,
        loadAccountPage: this.loadAccountPage,
        logoutHandler: this.logoutHandler,
      };
      return (
        <div className={classes.root}>
          <CssBaseline />
          <ResponsiveDrawer drawerData={drawerData} />

          <div>{this.state.render ? <Account /> : <Lists />}</div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(home);
