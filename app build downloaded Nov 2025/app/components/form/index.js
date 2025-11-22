/**
 * Form
 * @flow
 * @format
 */

import React from 'react';
import {validate} from 'validate.js';
import {withTranslation} from '@app/translations';

const allowedTypes = ['Input', 'Submit', 'Switch'];

// Types
type Props = {
  validationSchema: Object,
  handleSubmit: Function,
  children: React$Node,
  t: Function,
};

type State = {
  form: Object,
  errors: Object,
};

class InputsForm extends React.Component<Props, State> {
  inputRefs;
  fieldDefaultValues;
  submitPressed;

  constructor(props: Props) {
    super(props);
    this.inputRefs = [];
    this.fieldDefaultValues = {};
    this.submitPressed = false;
    this.state = {form: {}, errors: {}};
  }

  // It will use outside by ref
  submit = (props) => {
    this.submitPressed = true;
    const errors = this.validateForm();
    if (errors) {
      return;
    }

    const {handleSubmit} = this.props;
    handleSubmit && handleSubmit(this.getValues());
    props?.onPress?.();
  };

  validateForm = () => {
    const values = this.getValues();
    const {validationSchema} = this.props;

    const errors = validate(values, validationSchema, {
      // `grouped_first_error` is a custom formatter defined in utils.js
      format: 'grouped_first_error',
    });
    this.setState({errors});

    return errors;
  };

  onFormEdit = () => {
    if (this.submitPressed) {
      this.validateForm();
    }
  };

  onSubmitEditing = (activeIndex: number, props: Object) => {
    props.onSubmitEditing && props.onSubmitEditing();

    if (props.returnKeyType !== 'next') {
      return;
    }

    const inputRef = this.inputRefs.find(
      (input, index) => input && index > activeIndex,
    );
    inputRef?.focus();
  };

  onInputRef = (ref: any, inputIndex: number, props: Object) => {
    props.onInputRef && props.onInputRef();
    this.inputRefs[inputIndex] = ref;
  };

  onChangeText = (text: string, props: Object) => {
    const form = {...this.state.form, [props.name]: text};
    this.setState({form}, this.onFormEdit);
  };

  toggleSwitch = (fieldName) => {
    const form = {
      ...this.state.form,
      [fieldName]: !this.state.form[fieldName],
    };
    this.setState({form}, this.onFormEdit);
  };

  isFieldTouched = (name) => {
    // If filed name exist in form its mean field edited
    return this.state.form[name] !== undefined;
  };

  // It will also use outside for get values
  getValues = () => {
    return Object.entries(this.fieldDefaultValues).reduce(
      (acc, [name, value]) => {
        acc[name] = this.isFieldTouched(name) ? this.state.form[name] : value;
        return acc;
      },
      {},
    );
  };

  renderChildren() {
    const {children, t} = this.props;
    const {errors, form} = this.state;

    return React.Children.map(children, (child, index) => {
      if (!allowedTypes.includes(child?.props?.type)) {
        return child;
      }

      const {type, name, value, checked} = child.props;

      if (type === 'Input') {
        this.fieldDefaultValues[name] = value;

        return React.cloneElement(child, {
          onSubmitEditing: () => this.onSubmitEditing(index, child.props),
          onInputRef: (ref) => this.onInputRef(ref, index, child.props),
          onChangeText: (text) => this.onChangeText(text, child.props),
          value: this.isFieldTouched(name) ? form[name] : value,
          error: t(errors?.[name]),
        });
      }

      if (type === 'Switch') {
        this.fieldDefaultValues[name] = !!checked;

        return React.cloneElement(child, {
          onPress: () => this.toggleSwitch(name),
          checked: form?.[name],
          error: t(errors?.[name]),
        });
      }

      if (type === 'Submit') {
        return React.cloneElement(child, {
          onPress: () => this.submit(child.props),
        });
      }
    });
  }

  render() {
    return this.renderChildren();
  }
}

export const Form = withTranslation('', {withRef: true})(InputsForm);
