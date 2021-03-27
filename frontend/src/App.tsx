import React, { useState, useEffect} from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home';
import Create from './create';
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import { apiUrl } from './constants'
import { useHistory } from "react-router-dom";
import Header from './components/header';
import ViewFace from './show';
import Search from './search';

const App = () => {
  const history = useHistory();

  const theme = createMuiTheme({
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Work Sans"',
        '"Helvetica Neue"',
      ].join(","),
    },
  });
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== null) {
      fetch(`${apiUrl}/verify_access_token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => setLoggedIn(response.ok))
        .catch(() => history.push("/"));
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn, history]);
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Switch>
        <Route path="/" component={Home} exact />
          <Route path="/create" component={Create} exact />
          <Route path='/face/:faceName' component={ViewFace} exact />
          <Route path='/search/' component={Search} exact />
      </Switch>
      </BrowserRouter>
      </ThemeProvider>
  )
}

export default App;
