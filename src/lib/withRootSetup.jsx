import React, { Component } from 'react';
import { LOCATION_CHANGE } from 'react-router-redux';
import omit from 'ramda/src/omit';
import core from '../core';
import { splitQuery } from './query-helper';
import withRouter from './withRouterPatch';
import getDisplayName from './getDisplayName';
import { registerRouter } from './routing';

export default ComponentWithRootSetup => {
  const locationChange = location => core.get.store().dispatch({
    payload: {
      ...location,
      query: location.query || splitQuery(location.search),
    },
    type: LOCATION_CHANGE,
  });

  class RootSetup extends Component {
    static displayName = `withRootSetup(${getDisplayName(ComponentWithRootSetup)})`;
    static WrappedComponent = ComponentWithRootSetup.WrappedComponent || ComponentWithRootSetup;

    constructor(props) {
      super(props);
      // `withRouter passes router as props
      // @see: https://reacttraining.com/react-router/#withrouter
      const router = omit(['children'], props);
      // This enables core.get.router()
      registerRouter(router);
    }

    componentWillMount() {
      locationChange(this.props.location);
    }

    componentWillReceiveProps({ location }) {
      if (location !== this.props.location) {
        // @TODO - refactor when react-router-redux supports react-router v4
        locationChange(location);
      }
    }

    render() {
      return <ComponentWithRootSetup {...this.props} />;
    }
  }

  return withRouter(RootSetup);
};
