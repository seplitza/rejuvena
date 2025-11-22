/**
 * Input (TextInput Wrapper)
 * @flow
 * @format
 */

import React, {useState} from 'react';
import {TextInput, Pressable} from 'react-native';
import {Label} from '@app/components/label';
import { Icon } from '@app/components/icon';
import {styles} from './styles';

// Types
type TextInputProps = React.ComponentProps<typeof TextInput>;
type Props = TextInputProps & {
  containerStyle?: any,
  inputStyle?: any,
  onInputRef?: Function,
  error?: string,
  onPress: Function,
  rightSideContent: React$Node,
};

const Input = (props: Props) => {
  const {
    containerStyle,
    inputStyle,
    onInputRef,
    error,
    placeholderTextColor,
    secureTextEntry,
    placeholder,
    editable,
    rightSideContent,
    onPress,
    ...rest
  } = props;

  const inputRef = React.createRef();

  const [secureInput, setSecureInput] = useState(secureTextEntry);

  /**
   * Why doing this ?
   * In app design TextInput texts are center align.
   * for this using textAlign `center`. textAlign `center`
   * working fine in iOS but in android there is a weird behaviour -
   * when user type and clear input, cursor move to the end of the input.
   * to overcome this problem we can center align TextInput component with
   * a container component. Now another problem is TextInput clickable area
   * reduced due to center align in parent, to overcome this we have converted
   * parent with pressable and on press focusing input.
   */
  const focusInput = () => {
    editable && inputRef.current?.focus();
  };

  const setRef = (ref) => {
    onInputRef(ref);
    inputRef.current = ref;
  };

  const eyeIcon = () => {
    return (
      <Icon
        type="Ionicons"
        name={secureInput ? 'ios-eye-off-outline' : 'eye-outline'}
        style={styles.eyeIconStyle}
        onPress={() => setSecureInput(!secureInput)}
      />
    );
  };

  return (
    <>
      <Pressable
        testID="testPressable"
        style={[
          styles.container,
          containerStyle,
          error && styles.errorBorderStyle,
        ]}
        onPress={() => {
          focusInput();
          onPress?.();
        }}>
        <TextInput
          /**
           * Why using key here ?
           * When changing placeholder dynamic in android,
           * input width not reflecting. Like if placeholder
           * text width larger in english and short in russian
           * so when changing russian to english placeholder
           * text show half (pb: text cutting).
           */
          testID="testInput"
          key={placeholder}
          placeholder={placeholder}
          ref={setRef}
          allowFontScaling={false}
          style={[styles.inputStyle, inputStyle]}
          placeholderTextColor={
            placeholderTextColor || styles.placeholder?.color
          }
          secureTextEntry={secureInput}
          selectionColor={styles.selection?.color}
          editable={editable}
          {...rest}
        />
        {secureTextEntry && eyeIcon()}
        {rightSideContent}
        {}
      </Pressable>

      {!!error && <Label testID="testLabel" style={styles.errorStyle}>{error}</Label>}
    </>
  );
};

Input.defaultProps = {
  underlineColorAndroid: 'transparent',
  autoCorrect: false,
  spellCheck: false,
  autoCapitalize: 'none',
  onInputRef: () => {},
  rightSideContent: null,
};

export {Input};
