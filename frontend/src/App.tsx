import React, { useState, useEffect} from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home';
import Create from './create';
import { CssBaseline } from "@material-ui/core";
import { apiUrl } from './constants'
import { useHistory } from "react-router-dom";
import NavBar from './components/navBar';
import ViewFace from './show';
import Search from './search';

const App = () => {
  const history = useHistory();


  const [isLoggedIn, setLoggedIn] = useState(false);
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
  }, [isLoggedIn, history]);
  return (
    <>
    <CssBaseline />
    <BrowserRouter>
          <NavBar loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
      <Switch>
          <Route path="/" exact>
            <Home isLoggedIn={isLoggedIn}/></Route>
          <Route path="/create" exact >
            <Create isLoggedIn={isLoggedIn}/>
            </Route>
          <Route path='/face/:faceName' component={ViewFace} exact />
          <Route path='/search/' exact>
            <Search isLoggedIn={isLoggedIn}/>
            </Route>
      </Switch>
      </BrowserRouter>
      </>
  )
}

export default App;
