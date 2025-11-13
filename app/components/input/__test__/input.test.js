import React from 'react';
import 'react-native';
import {render, fireEvent} from '@testing-library/react-native';
import {Input} from '@app/components';

describe('snapshot', () => {
  it('should match snapshot', () => {
    const {toJSON, getByTestId} = render(<Input />);
    const testInput = getByTestId('testInput');
    expect(testInput).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('props', () => {
  it('containerStyle', () => {
    const {getByTestId} = render(<Input containerStyle={{height: 200}} />);
    const testPressable = getByTestId('testPressable');
    expect(testPressable.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({height: 200})]),
    );
  });
  it('inputStyle', () => {
    const {getByTestId} = render(<Input inputStyle={{width: 100}} />);
    const testInput = getByTestId('testInput');
    expect(testInput.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({width: 100})]),
    );
  });

  it('placeholder', () => {
    const {getByTestId} = render(<Input placeholder="myPlaceholder" />);
    const testInput = getByTestId('testInput');
    expect(testInput.props.placeholder).toBe('myPlaceholder');
  });
  it('should error message visible', () => {
    const {queryByText} = render(<Input error="first error" />);
    const testLabel = queryByText('first error');
    expect(testLabel).not.toBeNull();
  });
  it('should not be editable', () => {
    const {getByTestId} = render(<Input editable={false} />);
    const textInput = getByTestId('testInput');
    expect(textInput.props.editable).toBe(false);
  });
});

describe('methods', () => {
  it('should foucs the input', () => {
    const focus = jest.fn();
    const {getByTestId} = render(<Input onFocus={focus} />);
    const testInput = getByTestId('testInput');
    fireEvent(testInput, 'focus');
    expect(focus).toHaveBeenCalledTimes(1);
  });
  it('should trigger onChange', () => {
    const onChange = jest.fn();
    const {getByTestId} = render(<Input onChangeText={onChange} />);
    const testInput = getByTestId('testInput');
    fireEvent.changeText(testInput, 'demo');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
