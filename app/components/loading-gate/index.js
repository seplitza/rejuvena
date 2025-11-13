/**
 * Loading Gate
 * @flow
 * @format
 */

import React from 'react';
import {Loader} from '@app/components/loader';

type Props = {
  loading: boolean,
  children: React$Node,
};

const LoadingGate = (props: Props) => {
  const {loading, children} = props;
  if (loading) {
    return <Loader visible />;
  }

  return children;
};

export {LoadingGate};
