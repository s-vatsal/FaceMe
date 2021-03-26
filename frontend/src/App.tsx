import React from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home';
import CreatePhoneme from './create';


const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/create" component={CreatePhoneme} exact />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
