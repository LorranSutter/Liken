import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { theme } from "rimble-ui";
import { ThemeProvider } from "styled-components";

import Login from './pages/Login';
import Org from './pages/Org';
import NewModel from './pages/NewModel';
import ShareModel from './pages/ShareModel';

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
          <Route path='/org' exact component={Org} />
          <Route path='/org/models/new' exact component={NewModel} />
          <Route path='/org/models/share' exact component={ShareModel} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
