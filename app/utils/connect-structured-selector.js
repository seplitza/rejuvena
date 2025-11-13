/**
 * Connect Structured Selector
 * Helper function to connect component
 * with redux connect and add create structured
 * selector as mapStateToProps
 * @flow
 * @format
 */

import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

export const connectStructuredSelector = (
  mapStateToProps: Object | null,
  ...rest: Object[]
) => {
  if (mapStateToProps) {
    mapStateToProps = createStructuredSelector(mapStateToProps);
  }

  return connect(mapStateToProps, ...rest);
};
