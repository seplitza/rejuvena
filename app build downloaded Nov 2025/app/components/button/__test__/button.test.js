import React from 'react';
import 'react-native';
import {render} from '@testing-library/react-native';
import {Button} from '.././index';

describe('snapshot', () => {
  it('should match snapshot', () => {
    const {getByTestId, toJSON} = render(<Button />);
    const testButton = getByTestId('testButton');
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('props', () => {
  it('containerStyle ', () => {
    const {getByTestId} = render(<Button containerStyle={{width: 100}} />);
    const testButton = getByTestId('testButton');
    expect(testButton.props.style).toEqual(
      expect.objectContaining({width: 100}),
    );
  });
  it('titleStyle', () => {
    const {getByTestId} = render(<Button titleStyle={{color: 'red'}} />);
    const testLabel = getByTestId('testLabel');
    expect(testLabel);
  });
  it('ActivityIndicator should appear', () => {
    const {getByTestId} = render(<Button loading={true} />);
    const testActivityIndicator = getByTestId('testActivityIndicator');
    expect(testActivityIndicator).toBeDefined();
  });
});
