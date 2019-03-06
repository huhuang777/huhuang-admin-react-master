import React from 'react';
import { render } from 'react-dom'
import * as serviceWorker from './serviceWorker';
import createRoutes from './routes'
import AppContainer from './containers/AppContainer'
import './assets/styles/app.scss'

const MOUNT_NODE = document.getElementById('root')

const renderApp = (DevTools = null) => {
    const routes = createRoutes(); 
      // const DevTools = require('~components/DevTools').default
      render(
        <AppContainer routes={routes} store={null}>
          {/*<DevTools />*/}
        </AppContainer>,
        MOUNT_NODE
      )
  
  }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
renderApp();