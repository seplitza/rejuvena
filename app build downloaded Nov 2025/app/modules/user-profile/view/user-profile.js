/**
 * User Profile Screen
 * @flow
 * @format
 */

import React from 'react';
import {View, TouchableOpacity, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import SegmentedTab from 'react-native-segmented-control-tab';
import {withTranslation} from '@app/translations';
import {gradients} from '@app/styles';
import {connectStructuredSelector, trackEvent} from '@app/utils';
import {ImageSource} from '@app/common';
import {getUserProfile, updateUserInfo, changePassword} from '../slice';
import {selectMyProfile} from '../selectors';
import {
  Heading,
  Form,
  Input,
  Label,
  Button,
  Icon,
  ImagePicker,
  CacheImage,
} from '@app/components';
import {userInfoSchema, changePasswordSchema} from '../validator';
import DeleteAccountConfirmationPopup from './delete_account_confirmation_popup';
import {styles} from './styles';

// Types
type Props = {
  profile: Object,
  updateUserInfo: typeof updateUserInfo,
  getUserProfile: typeof getUserProfile,
  changePassword: typeof changePassword,
  t: Function,
};
type State = {
  selectedVideoServer?: string,
  pickedImage?: Object,
};

// Available video servers
const videoServers = ['Vimeo', 'Azure'];
class UserProfile extends React.Component<Props, State> {
  imagePickerRef;
  userInfoFormRef;

  constructor(props) {
    super(props);
    this.state = {};
    this.imagePickerRef = React.createRef();
    this.userInfoFormRef = React.createRef();
    this.deleteAccountConfRef = React.createRef();
  }

  componentDidMount() {
    trackEvent('View Profile');
    this.props.getUserProfile();
  }

  onImagePicked = (pickedImage) => {
    this.setState({pickedImage});
  };

  onSubmitUserInfo = (values) => {
    Keyboard.dismiss();
    const {profile} = this.props;
    const {selectedVideoServer, pickedImage} = this.state;
    const {firstName, lastName} = values;
    this.props.updateUserInfo({
      email: profile?.email,
      firstName,
      lastName,
      videoServer: selectedVideoServer || profile?.videoServer,
      pickedImage,
    });
  };

  onSubmitPassword = (values) => {
    Keyboard.dismiss();
    this.props.changePassword(values);
  };

  setVideoServer(selectedVideoServer) {
    this.setState({selectedVideoServer});
  }

  render() {
    const {profile, t} = this.props;
    const {selectedVideoServer, pickedImage} = this.state;
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* User Information */}
          <Heading
            title={t('editProfilePage.personalInformation')}
            containerStyle={styles.headingContainerStyle}
            tittleStyle={styles.headingTitleStyle}
          />
          <View style={styles.section}>
            <Label style={styles.labelStyle}>
              {t('editProfilePage.yourAccountRegisterBy')}
            </Label>
            <Label style={[styles.labelStyle, styles.emailLabelStyle]}>
              {profile?.email}
            </Label>
            <Label style={styles.labelStyle}>
              {t('editProfilePage.editProfileMessage')}
            </Label>
            {/* Form */}
            <View style={styles.formContainer}>
              <Form
                ref={this.userInfoFormRef}
                validationSchema={userInfoSchema}
                handleSubmit={this.onSubmitUserInfo}>
                <Label style={styles.labelStyle}>
                  {t('editProfilePage.name')}
                </Label>
                <Input
                  name="firstName"
                  value={profile?.firstName}
                  containerStyle={styles.inputContainerStyle}
                  inputStyle={styles.inputStyle}
                  type="Input"
                  autoCapitalize="words"
                />
                <Label style={styles.labelStyle}>
                  {t('editProfilePage.lname')}
                </Label>
                <Input
                  name="lastName"
                  value={profile?.lastName}
                  containerStyle={styles.inputContainerStyle}
                  inputStyle={styles.inputStyle}
                  type="Input"
                  autoCapitalize="words"
                />
                <Label style={styles.labelStyle}>
                  {t('editProfilePage.player')}
                </Label>
                <SegmentedTab
                  values={videoServers}
                  selectedIndex={videoServers.indexOf(
                    selectedVideoServer || profile?.videoServer,
                  )}
                  onTabPress={(index) =>
                    this.setVideoServer(videoServers[index])
                  }
                  tabsContainerStyle={styles.tabsContainerStyle}
                  tabStyle={styles.tabStyle}
                  tabTextStyle={styles.tabTextStyle}
                  activeTabStyle={styles.activeTabStyle}
                />
              </Form>
            </View>

            <View style={styles.profilePictureContainer}>
              <CacheImage
                placeholderSource={ImageSource.imagePlaceholder}
                source={{uri: pickedImage?.path || profile?.profilePicture}}
                style={styles.profilePictureStyle}
              />
              <TouchableOpacity
                style={styles.cameraIconContainer}
                onPress={() => {
                  this.imagePickerRef.current?.showImagePicker({
                    width: 400,
                    height: 400,
                    cropping: true,
                  });
                }}>
                <Icon
                  type="Ionicons"
                  name="camera"
                  style={styles.cameraIconStyle}
                />
              </TouchableOpacity>
            </View>
            <Button
              gradientColors={gradients.btn}
              enableGradient
              containerStyle={styles.buttonStyle}
              titleStyle={styles.buttonTitleStyle}
              title={t('editProfilePage.update')}
              onPress={() => this.userInfoFormRef.current?.submit()}
            />
          </View>

          {/* Update Password */}
          {!profile?.isSocialLogin && (
            <Heading
              title={t('editProfilePage.changePassword')}
              containerStyle={styles.headingContainerStyle}
              tittleStyle={styles.headingTitleStyle}
            />
          )}
          {!profile?.isSocialLogin && (
            <LinearGradient
              colors={gradients.header}
              useAngle
              angle={180}
              locations={[0.8, 1]}
              style={styles.section}>
              <View style={styles.formContainer}>
                <Form
                  validationSchema={changePasswordSchema}
                  handleSubmit={this.onSubmitPassword}>
                  <Label style={styles.labelStyle}>
                    {t('editProfilePage.enterOldPassword')}
                  </Label>
                  <Input
                    name="oldPassword"
                    secureTextEntry
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    type="Input"
                  />

                  <Label style={styles.labelStyle}>
                    {t('editProfilePage.enterNewPassword')}
                  </Label>
                  <Input
                    name="newPassword"
                    secureTextEntry
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    type="Input"
                  />

                  <Label style={styles.labelStyle}>
                    {t('editProfilePage.enterNewPasswordAgain')}
                  </Label>
                  <Input
                    name="confirmPassword"
                    secureTextEntry
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    returnKeyType="done"
                    type="Input"
                  />
                  <Button
                    gradientColors={gradients.btn}
                    enableGradient
                    containerStyle={styles.buttonStyle}
                    titleStyle={styles.buttonTitleStyle}
                    title={t('editProfilePage.update')}
                    type="Submit"
                  />
                </Form>
              </View>
            </LinearGradient>
          )}
          <Button
            containerStyle={styles.deleteButtonStyle}
            titleStyle={styles.deleteButtonTitleStyle}
            title={t('editProfilePage.deleteAccount')}
            onPress={() => this.deleteAccountConfRef.current?.show()}
          />
        </KeyboardAwareScrollView>
        <DeleteAccountConfirmationPopup ref={this.deleteAccountConfRef} t={t} />
        <ImagePicker
          ref={this.imagePickerRef}
          onImagePicked={this.onImagePicked}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = {
  profile: selectMyProfile,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {
    updateUserInfo,
    getUserProfile,
    changePassword,
  })(UserProfile),
);
