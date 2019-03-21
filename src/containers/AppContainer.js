import React, { Component,Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import createStore from "../store"
import PageLoading from "../components/PageLoading"
import { TOKEN } from '../constants/auth';

class AppContainer extends Component {

  static propTypes = {
    routes: PropTypes.object.isRequired,
    children: PropTypes.element // Just React DevTools
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  layoutRender = ( props ) => {
    const { routes } = this.props
    const Layout = routes.component
    const childRoutes = routes.childRoutes
    const token=localStorage.getItem(TOKEN);
    return (
      // <Suspense fallback={<PageLoading />}>
        <Layout>
          <Switch>
            {
              childRoutes.map((route, index) => {
                return (
                  route.redirect ? (
                    <Redirect {...route.redirect} key={index} />
                  ) : (
                    // eslint-disable-next-line react/jsx-no-bind
                    <Route {...route} key={index} 
                    // render={props =>
                    //   !route.noLogin&&!token?<Redirect to={{pathname: '/login',state: { from: props.location }}} />:(<route.component {...props} />)
                    // }
                    />
                  )
                )
              })
            }
          </Switch>
        </Layout>
      // </Suspense>
    )
  }
  
  render () {
    const { routes, children } = this.props
    const store = createStore() 
    return (
      <Provider store={store}>
        <div className="app">
          <Router basename={routes.basename || '/'}>
            <Route render={this.layoutRender} />
          </Router>
          { children }
        </div>
      </Provider>
    )
  }

}

export default AppContainer
