import withRouter from 'react-router-dom/withRouter';

// This is a helper to expose the wrapped component for testing as withRouter does not :(
export default Component => {
  const ComponentWithRouter = withRouter(Component);
  ComponentWithRouter.WrappedComponent = Component.WrappedComponent || Component;

  return ComponentWithRouter;
};
