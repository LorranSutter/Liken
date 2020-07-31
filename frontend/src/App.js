import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { theme } from "rimble-ui";
import { ThemeProvider } from "styled-components";

import Login from './pages/Login';
import Client from './pages/Client';
// import NewClient from './pages/NewClient';

const customTheme = {
  ...theme
};

customTheme.colors.primary = "#35C0EDff";
// customTheme.colors.primary = "#0AC5A8ff";

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/index' exact component={Login} />
          <Route path='/login' exact component={Login} />
          <Route path='/client' exact component={Client} />
          {/* <Route path='/fi/newClient' exact component={NewClient} /> */}
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
