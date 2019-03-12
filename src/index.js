import React from 'react';
import { render } from 'react-dom'
import * as serviceWorker from './serviceWorker';
import createRoutes from './routes'
import AppContainer from './containers/AppContainer'
import './assets/styles/app.scss'

const MOUNT_NODE = document.getElementById('root')

const renderApp = (DevTools = null) => {
    serviceWorker.unregister();
    const routes = createRoutes(); 
      // const DevTools = require('~components/DevTools').default
      render(
        <AppContainer routes={routes}>
          {/*<DevTools />*/}
        </AppContainer>,
        MOUNT_NODE
      )
  
  }

renderApp();