/**
 * Congratulation Screen
 * @flow
 * @format
 */

import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {
  Label,
  HeaderButton,
  Container,
  Input,
  Icon,
  Button,
} from '@app/components';
import {ImageSource} from '@app/common';
import {withTranslation} from '@app/translations';
import {congratsPopupStyles as styles} from './styles';
import {setRecordForBeforePhotoUpload} from '../slice';

type Props = {
  navigation: Object,
  t: Function,
};
type State = {
  form: Object,
};

const commentInputMinHeight = 40;
const commentInputMaxHeight = 160;
class Congrats extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      form: {age: '', weight: '', height: '', comment: ''},
      like: false,
      commentInputHeight: commentInputMinHeight,
    };
  }

  componentDidMount() {
    this.props.navigation
      .dangerouslyGetParent()
      ?.setParams({tabBarVisible: false});
  }

  componentWillUnmount() {
    this.props.navigation
      .dangerouslyGetParent()
      ?.setParams({tabBarVisible: true});
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
    const {form, like} = this.state;
    const {comment, age, weight, height} = form;
    const {route} = this.props;
    const isItForAfter = route.params?.forAfter;
    this.goBack();
    this.props.setRecordForBeforePhotoUpload({
      isItForAfter,
      comment,
      age,
      weight,
      height,
      like,
    });
  };

  goBack = () => {
    this.props.navigation.goBack();
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
    const {route, t} = this.props;
    const {form, like, commentInputHeight} = this.state;
    const isItForAfter = route.params?.forAfter;
    const userRecord = route.params?.userRecord;
    const botAge = isItForAfter
      ? Math.round(userRecord[0]?.afterAgeBot)
      : Math.round(userRecord[0]?.beforeAgeBoT);
    return (
      <Container style={styles.container}>
        <HeaderButton style={styles.headerButtonStyle} onPress={this.goBack}>
          <Icon type="EvilIcons" name="close" style={styles.closeIconStyle} />
        </HeaderButton>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewStyle}>
          <Label style={styles.titleStyle}>
            {t('photoDiaryPage.faceLift')}
          </Label>
          <Label style={[styles.titleStyle, styles.congratsLabelStyle]}>
            {t('photoDiaryPage.congratulation')}
          </Label>

          <Label style={styles.photoUploadMessage}>
            {t('photoDiaryPage.photoUploadMessage')}
          </Label>
          <View style={styles.row}>
            <Label style={[styles.labelStyle, styles.width]}>
              {t('photoDiaryPage.botAge')}
            </Label>
            <Input
              value={botAge.toString()}
              maxLength={3}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainerStyle}
            />
          </View>
          <View style={styles.row}>
            <Label style={[styles.labelStyle, styles.width]}>
              {t('photoDiaryPage.age')}
            </Label>
            <Input
              value={form?.age}
              onChangeText={(value) => this.onChangeInput('age', value)}
              keyboardType="number-pad"
              maxLength={3}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainerStyle}
            />
          </View>

          <View style={styles.row}>
            <Label style={[styles.labelStyle, styles.width]}>
              {t('photoDiaryPage.weight')}
            </Label>
            <Input
              value={form?.weight}
              onChangeText={(value) => this.onChangeInput('weight', value)}
              keyboardType="number-pad"
              maxLength={5}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainerStyle}
            />
          </View>

          <View style={styles.row}>
            <Label style={[styles.labelStyle, styles.width]}>
              {t('photoDiaryPage.height')}
            </Label>
            <Input
              value={form?.height}
              onChangeText={(value) => this.onChangeInput('height', value)}
              keyboardType="number-pad"
              maxLength={5}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainerStyle}
            />
          </View>

          <Label style={[styles.labelStyle, styles.whatYouAchievedLabelStyle]}>
            {isItForAfter
              ? t('photoDiaryPage.whatYouHaveAchieved')
              : t('photoDiaryPage.whatIsThePurpose')}
          </Label>

          <Input
            value={form?.comment}
            onChangeText={(value) => this.onChangeInput('comment', value)}
            inputStyle={[styles.inputStyle, {height: commentInputHeight}]}
            containerStyle={[
              styles.goalInputContainer,
              {height: commentInputHeight},
            ]}
            multiline
            onContentSizeChange={this.getCommentInputHeight}
          />
          <View style={styles.footerSection}>
            <TouchableOpacity onPress={() => this.setState({like: !like})}>
              <Image
                source={ImageSource.like}
                style={[styles.likeIconStyle, !like && styles.unLikeStyle]}
              />
            </TouchableOpacity>
            <Button
              title={t('photoDiaryPage.save')}
              containerStyle={styles.buttonStyle}
              onPress={this.submitRecord}
            />
            <HeaderButton onPress={this.goBack}>
              <Icon
                type="EvilIcons"
                name="close"
                style={styles.closeIconStyle}
              />
            </HeaderButton>
          </View>
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default withTranslation()(
  connect(null, {setRecordForBeforePhotoUpload})(Congrats),
);
