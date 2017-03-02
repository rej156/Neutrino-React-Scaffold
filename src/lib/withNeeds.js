import React, { Component } from 'react';

import getDisplayName from './getDisplayName';
import core from '../core';

export default ContainerWithNeeds => {
  const registerNeeds = (componentName, needs, needArgs) => {
    if (core.get.componentNeeds()[componentName]) {
      // Component needs already registered
      return;
    }

    core.register.componentNeeds({ [componentName]: needs.map(getNeedAction => getNeedAction(needArgs) || {}) });
  };

  return class WithNeeds extends Component {
    static defaultProps = { match: { params: {} } };

    constructor(props) {
      super(props);

      if (!process.browser) {
        const { displayName, WrappedComponent: { needs } } = WithNeeds;
        const { match: { params }, cmsPageName, contentType } = props;
        const location = core.get.store().getState().routing.location;

        registerNeeds(displayName, needs, {
          ...params,
          ...location,
          isCmsPage: contentType === 'page',
          cmsPageName: params.cmsPageName || cmsPageName,
        });
      }
    }

    render() {
      return <ContainerWithNeeds {...this.props} />;
    }
  };
};
