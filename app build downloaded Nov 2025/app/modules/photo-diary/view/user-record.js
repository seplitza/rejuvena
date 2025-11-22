/**
 * Set User Record Screen
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {
  Label,
  Input,
  Button,
  HeaderButton,
  Icon,
  Container,
} from '@app/components';
import {congratsPopupStyles as styles} from './styles';
import {setRecordForBeforePhotoUpload} from '../slice';

type Props = {
  t: Function,
  navigation: Object,
};
type State = {
  form: Object,
};

const commentInputMinHeight = 40;
const commentInputMaxHeight = 160;
class UserRecord extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        age: undefined,
        weight: undefined,
        height: undefined,
        comment: undefined,
      },
      commentInputHeight: commentInputMinHeight,
    };
  }

  onChangeInput(key, value) {
    this.setState({
      form: {
        ...this.state.form,
        [key]: value,
      },
    });
  }

  submitRecord = () => {
    this.props.onPress && this.props.onPress();
    const {form} = this.state;
    const {isItForAfter, details} = this.props;
    const {
      beforeAge,
      afterAge,
      beforeWeight,
      afterWeight,
      beforeHeight,
      afterHeight,
      beforeComment,
      afterComment,
    } = details || {};
    const {comment, age, weight, height} = form;
    if (
      comment !== undefined ||
      age !== undefined ||
      weight !== undefined ||
      height !== undefined
    ) {
      this.props.setRecordForBeforePhotoUpload({
        isItForAfter,
        comment:
          comment === undefined
            ? isItForAfter
              ? afterComment
              : beforeComment
            : comment,
        age: age === undefined ? (isItForAfter ? afterAge : beforeAge) : age,
        weight:
          weight === undefined
            ? isItForAfter
              ? afterWeight
              : beforeWeight
            : weight,
        height:
          height === undefined
            ? isItForAfter
              ? afterHeight
              : beforeHeight
            : height,
      });
    }
  };

  getCommentInputHeight = (event) => {
    const {height} = event?.nativeEvent?.contentSize;
    if (height <= commentInputMaxHeight && height > commentInputMinHeight) {
      this.setState({commentInputHeight: height});
    } else if (height < commentInputMinHeight) {
      this.setState({commentInputHeight: commentInputMinHeight});
    }
  };

  render() {
    const {t, isItForAfter, details} = this.props;
    const {
      beforeAge,
      afterAge,
      beforeWeight,
      afterWeight,
      beforeHeight,
      afterHeight,
      beforeComment,
      afterComment,
    } = details || {};
    const {form, commentInputHeight} = this.state;
    return (
      <Container>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.userRecordContentContainer}
          enableAutomaticScroll={true}
          enableOnAndroid={true}>
          <HeaderButton
            style={styles.headerButtonStyle}
            onPress={() => this.props.onPress()}>
            <Icon type="EvilIcons" name="close" style={styles.closeIconStyle} />
          </HeaderButton>
          <View style={styles.sizeBox} />

          <Label style={styles.labelStyle}>
            {t('photoDiaryPage.fillParameters')}
          </Label>
          <View style={styles.sizeBox} />
          <View style={styles.sizeBox} />
          <View style={styles.contentStyle}>
            <Label style={[styles.width, styles.labelStyle]}>
              {t('photoDiaryPage.age')}
            </Label>
            <Input
              value={
                form?.age === undefined
                  ? isItForAfter
                    ? afterAge
                    : beforeAge
                  : form?.age
              }
              onChangeText={(value) => this.onChangeInput('age', value)}
              keyboardType="number-pad"
              maxLength={3}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainerStyle}
            />
          </View>

          <View style={styles.contentStyle}>
            <Label style={[styles.width, styles.labelStyle]}>
              {t('photoDiaryPage.weight')}
            </Label>
            <Input
              value={
                form?.weight === undefined
                  ? isItForAfter
                    ? afterWeight
                    : beforeWeight
                  : form?.weight
              }
              onChangeText={(value) => this.onChangeInput('weight', value)}
              keyboardType="number-pad"
              maxLength={5}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainerStyle}
            />
          </View>

          <View style={styles.contentStyle}>
            <Label style={[styles.width, styles.labelStyle]}>
              {t('photoDiaryPage.height')}
            </Label>
            <Input
              value={
                form?.height === undefined
                  ? isItForAfter
                    ? afterHeight
                    : beforeHeight
                  : form?.height
              }
              onChangeText={(value) => this.onChangeInput('height', value)}
              keyboardType="number-pad"
              maxLength={5}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainerStyle}
            />
          </View>
          <View style={styles.sizeBox} />

          <Label style={[styles.whatYouAchievedLabelStyle, styles.labelStyle]}>
            {isItForAfter
              ? t('photoDiaryPage.whatYouHaveAchieved')
              : t('photoDiaryPage.whatIsThePurpose')}
          </Label>
          <View style={styles.sizeBox} />
          <Input
            value={
              form?.comment === undefined
                ? isItForAfter
                  ? afterComment
                  : beforeComment
                : form?.comment
            }
            onChangeText={(value) => this.onChangeInput('comment', value)}
            inputStyle={[styles.inputStyle, {height: commentInputHeight}]}
            containerStyle={[
              styles.goalInputContainer,
              {height: commentInputHeight},
            ]}
            multiline
            onContentSizeChange={this.getCommentInputHeight}
          />
          <View style={styles.sizeBox} />
          <Button
            title={t('photoDiaryPage.save')}
            containerStyle={styles.buttonStyle}
            onPress={this.submitRecord}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default connect(null, {setRecordForBeforePhotoUpload}, null, {
  forwardRef: true,
})(UserRecord);
