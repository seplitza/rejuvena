/**
 * Photo Diary
 * Upload images in photodiary
 * @flow
 * @format
 */

import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Pressable,
  Platform,
  ImageBackground,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actions-sheet';
import RNFetchBlob from 'rn-fetch-blob';
import {withTranslation} from '@app/translations';
import {
  connectStructuredSelector,
  fixUrl,
  trackEvent,
  AsyncStorage,
} from '@app/utils';
import {writeStorage, RESULTS} from '@app/utils/permission-handler';
import {showAlert, showToast} from '@app/global';
import {logout, setNewUser, selectGuestUser} from '@app/modules/common';
import {getContestImages, confirmImage, getContest} from '../slice';
import {
  uploadImage,
  getCollagePDF,
  getCollageImage,
  getAgeBot,
} from '../request';
import {
  selectContest,
  selectContestImages,
  selectIsGettingImages,
  selectIsTermsAccepted,
  selectUserRecord,
} from '../selectors';
import {
  Label,
  TouchableItem,
  LoadingGate,
  SetPermission,
  Icon,
} from '@app/components';
import {ImageSource} from '@app/common';
import {ImageWithTitle} from './image-with-title';
import {ImagePickerWithMask} from './image-picker-with-mask';
import Rules from './rules';
import ImageConfirmationPopup from './image-confirmation-popup';
import ImageUploadLoader from './image-upload-loader';
import {gradients} from '@app/styles';
import styles from './styles';
import UserRecord from './user-record';
import CollageDownloadPopup from './collage-download-popup';
import {PDFSuccessfullyDownloadPopup} from './pdf-successfully-download-popup';
import {GuestUserSignupPopup} from './guest-user-signup-popup';
import {AgeBotPopup} from './age-bot-popup';
import {PhotoUploadInstructionPopup} from './photo-upload-instruction-popup';

const imagePositionMap = {
  frontViewBefore: 1,
  frontViewAfter: 2,
  left34ViewBefore: 3,
  left34ViewAfter: 4,
  leftViewBefore: 5,
  leftViewAfter: 6,
  right34ViewBefore: 7,
  right34ViewAfter: 8,
  rightViewBefore: 9,
  rightViewAfter: 10,
  backViewBefore: 11,
  backViewAfter: 12,
};

// Using in saga
export const beforePositions = [1, 3, 5, 7, 9, 11];
export const afterPositions = [2, 4, 6, 8, 10, 12];

const maskTypes = {
  1: 'front',
  2: 'front',
  3: '3/4left',
  4: '3/4left',
  5: 'left',
  6: 'left',
  7: '3/4right',
  8: '3/4right',
  9: 'right',
  10: 'right',
  11: 'back',
  12: 'back',
};

const imagePickerOptions = {};

type Props = {};
type State = {
  visibleUserRecordPanel: boolean,
  isItForAfter: boolean,
};

class PhotoDiary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      visibleImageUploadLoader: false,
      downloadingImageCollage: false,
      downloadingPdfCollage: false,
      uploadProgress: 0,
      visibleUserRecordPanel: false,
      isItForAfter: false,
      photoDiaryImages: [],
      visibleCollagePopup: false,
      visibleOpenPDFPopup: false,
      visiblePhotoUploadInstructionPopup: false,
      visibleGuestUserSignupPopup: false,
      loadingLocalImages: true,
      pdfPath: '',
      localContestImage: {
        1: {
          imagePath: null,
          age: null,
        },
        2: {
          imagePath: null,
          age: null,
        },
      },
    };
    this.imagePickerRef = React.createRef();
    this.imageConfirmationRef = React.createRef();
    this.userRecordRef = React.createRef();
    this.scrollViewRef = React.createRef();
    this.setPermissionRef = React.createRef();
    this.ageBotRef = React.createRef();
    this.actionSheetRef = React.createRef();
    this.imagePosition = -1;
    this.croppedResult = null;
  }

  componentDidMount() {
    trackEvent('View PhotoDiaryScreen');
    const {isGuestUser} = this.props;
    if (isGuestUser) {
      this.getLocalContestImage();
      this.props.dispatch(getContest());
    } else {
      this.props.dispatch(getContestImages());
    }
  }

  getLocalContestImage = async () => {
    const beforeImageAndAge = await AsyncStorage.getItem('@AgeBotPhoto1');
    const afterImageAndAge = await AsyncStorage.getItem('@AgeBotPhoto2');
    this.setState({
      localContestImage: {
        1: JSON?.parse(beforeImageAndAge),
        2: JSON?.parse(afterImageAndAge),
      },
      loadingLocalImages: false,
    });
  };

  hideCollagePopup = () => {
    this.setState({visibleCollagePopup: false});
  };

  showCollagePopup = () => {
    this.setState({visibleCollagePopup: true});
  };

  showOpenPDFPopup = (pdfPath) => {
    this.setState({visibleOpenPDFPopup: true, pdfPath});
  };

  hideOpenPDFPopup = () => {
    this.setState({visibleOpenPDFPopup: false});
  };

  showImagePicker(imagePosition, demoImage) {
    const {contest, isGuestUser} = this.props;
    this.imagePosition = imagePosition;

    let pickerOptions = {...imagePickerOptions};

    /**
     * Currently backend api not support back image
     * auto cropping so enable manually cropping for
     * back images
     */
    if (maskTypes[imagePosition] === 'back') {
      pickerOptions.cropping = true;
    }
    if (!contest?.isAutoCrop && !isGuestUser) {
      pickerOptions.cropping = true;
    }
    this.imagePickerRef.current?.showImagePicker(pickerOptions, demoImage);
  }

  onImagePicked = async (image) => {
    try {
      const {contest, isGuestUser} = this.props;
      const {id, marathonId} = contest || {};
      const details = {
        contestId: id,
        marathonId,
        imagePosition: this.imagePosition,
        maskType: maskTypes[this.imagePosition],
      };
      this.setState({visibleImageUploadLoader: true});
      if (isGuestUser) {
        const {age, cropImagePath} = await getAgeBot(
          image,
          this.onUploadProgress,
        );
        const response = await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'png',
        }).fetch('GET', encodeURI(cropImagePath));
        let imageAndAge = {
          imagePath:
            Platform.OS === 'android'
              ? `file://${response?.path()}`
              : response?.data,
          age,
        };
        this.setState({
          localContestImage: {
            ...this.state.localContestImage,
            [`${this.imagePosition}`]: imageAndAge,
          },
        });
        await AsyncStorage.setItem(
          `@AgeBotPhoto${this.imagePosition}`,
          JSON.stringify(imageAndAge),
        );
        this.ageBotRef.current?.open(age);
      } else {
        const response = await uploadImage(
          details,
          image,
          this.onUploadProgress,
        );
        this.imageDetails = details;
        this.croppedResult = response;
        this.imageConfirmationRef.current?.open(response?.[0]);
      }
    } catch (err) {
      if (err.includes('Face Angle should be proper')) {
        this.setState({visiblePhotoUploadInstructionPopup: true});
        return;
      }
      showAlert('', err);
    } finally {
      this.setState({visibleImageUploadLoader: false, uploadProgress: 0});
    }
  };

  removePhotos = async () => {
    const {t} = this.props;
    const keys = ['@AgeBotPhoto1', '@AgeBotPhoto2'];
    try {
      await AsyncStorage.multiRemove(keys);
      this.getLocalContestImage();
      showToast({
        message: t('photoDiaryPage.deleteMessage'),
        duration: 3000,
        position: 'top',
      });
    } catch {}
  };

  onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    this.setState({uploadProgress: percentCompleted});
  };

  onConfirmImage = () => {
    const [fileName, imgPath] = this.croppedResult;
    this.props.dispatch(
      confirmImage({
        details: this.imageDetails,
        imgPath,
        fileName,
      }),
    );
  };

  onPressPDFDownloadCollage = async () => {
    try {
      const result = await writeStorage().request();
      if (result === RESULTS.BLOCKED) {
        return this.setPermissionRef.current?.show(false);
      } else if (result === RESULTS.DENIED) {
        this.setState({
          visibleCollagePopup: false,
        });
        throw new Error(t('photoDiaryPage.permissionNotGranted'));
      }
      this.setState({downloadingPdfCollage: true});
      const {contest, t} = this.props;

      const pdfUrl = await getCollagePDF(contest?.marathonId);
      const {config, fs, android, ios} = await RNFetchBlob;
      const date = new Date();

      const {DownloadDir, DocumentDir} = fs.dirs;
      const dirToSave = Platform.OS === 'ios' ? DocumentDir : DownloadDir;
      const configOpts = {
        fileCache: true,
        path: `${dirToSave}/collage_${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}.pdf`,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configOpts.fileCache,
          path: configOpts.path,
        },
        android: {
          fileCache: configOpts.fileCache,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: configOpts.path,
            description: 'Downloading collage pdf',
          },
        },
      });

      config(configOptions)
        .fetch('GET', fixUrl(pdfUrl))
        .then(
          (res) => this.showOpenPDFPopup(fixUrl(pdfUrl)),
          trackEvent('PDF_DOWNLOADED'),
        )
        .catch((e) => showAlert('', e.message))
        .finally(() => {
          this.setState({
            downloadingPdfCollage: false,
            visibleCollagePopup: false,
          });
        });
    } catch (e) {
      this.setState({
        downloadingPdfCollage: false,
        visibleCollagePopup: false,
      });
      showAlert('', e.message);
    }
  };

  onPressImageDownloadCollage = async () => {
    try {
      const result = await writeStorage().request();
      if (result === RESULTS.BLOCKED) {
        return this.setPermissionRef.current?.show(false);
      } else if (result === RESULTS.DENIED) {
        this.setState({
          visibleCollagePopup: false,
        });
        throw new Error(t('photoDiaryPage.permissionNotGranted'));
      }
      this.setState({downloadingImageCollage: true});
      const {contest, t} = this.props;

      const imageUrl = await getCollageImage(contest?.marathonId);
      const {config, fs, android, ios} = await RNFetchBlob;
      const date = new Date();
      const {DownloadDir, DocumentDir} = fs.dirs;
      const dirToSave = Platform.OS === 'ios' ? DocumentDir : DownloadDir;
      const configOpts = {
        fileCache: true,
        path: `${dirToSave}/collage_${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}.png`,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configOpts.fileCache,
          path: configOpts.path,
        },
        android: {
          fileCache: configOpts.fileCache,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: configOpts.path,
          },
        },
      });

      config(configOptions)
        .fetch('GET', encodeURI(imageUrl))
        .then((res) => {
          Platform.OS === 'ios'
            ? ios.previewDocument(res.path())
            : android.actionViewIntent(res.path(), 'image/png');
          trackEvent('COLLAGE_DOWNLOADED');
        })
        .catch((e) => {
          showAlert('', e.message);
        })
        .finally(() =>
          this.setState({
            downloadingImageCollage: false,
            visibleCollagePopup: false,
          }),
        );
    } catch (e) {
      this.setState({
        downloadingImageCollage: false,
        visibleCollagePopup: false,
      });
      showAlert('', e.message);
    }
  };

  showPhotoDiaryRules = () => {
    this.actionSheetRef.current?.show();
  };

  showUserRecord = (isItForAfter) => {
    const {contestImages, t} = this.props;
    if (
      Object.keys(contestImages).findIndex((key) =>
        beforePositions.includes(Number(key)),
      ) === -1
    ) {
      showToast({
        message: t('photoDiaryPage.uploadMinimumImageError'),
        type: 'error',
        position: 'bottom',
      });
      return;
    }
    this.setState({visibleUserRecordPanel: true, isItForAfter});
  };

  hideUserRecord = () => {
    if (this.state.visibleUserRecordPanel) {
      this.setState({visibleUserRecordPanel: false}, () => {
        this.userRecordRef.current?.submitRecord();
      });
    }
  };

  _navigateToSignUpScreen = () => {
    this.hideGuestUserSignupPopup();
    this.props.dispatch(logout({showSingUpScreen: true}));
    this.props.dispatch(setNewUser(false));
  };

  showGuestUserSignupPopup = () => {
    this.setState({visibleGuestUserSignupPopup: true});
  };

  hideGuestUserSignupPopup = () => {
    this.setState({visibleGuestUserSignupPopup: false});
  };

  closePhotoUploadInstructionPopup = () => {
    this.setState({visiblePhotoUploadInstructionPopup: false});
  };

  renderImageSection(
    title,
    demoImage,
    maskImage,
    beforeImagePosition,
    afterImagePosition,
  ) {
    const {localContestImage} = this.state;
    const {contestImages, t, isGuestUser} = this.props;
    const photoDiaryImages = isGuestUser ? localContestImage : contestImages;
    const beforeImage = photoDiaryImages?.[beforeImagePosition]?.imagePath;
    const afterImage = photoDiaryImages?.[afterImagePosition]?.imagePath;
    const beforeAgeBot = photoDiaryImages?.[beforeImagePosition]?.age;
    const afterAgeBot = photoDiaryImages?.[afterImagePosition]?.age;
    const textToImage =
      title === t('photoDiaryPage.closeUp')
        ? t('photoDiaryPage.anyProblematicPlace')
        : '';
    const isItForFront = title === t('photoDiaryPage.front');
    const shouldShowImagePickerWithMaskPopup = isGuestUser
      ? isItForFront
      : true;

    return (
      <View style={styles.imageSectionStyle}>
        <ImageWithTitle
          source={demoImage}
          title={title}
          textToImage={textToImage}
          shouldShowTextToImage={true}
        />
        <ImageWithTitle
          source={{uri: beforeImage}}
          title={t('photoDiaryPage.upload')}
          onPress={() =>
            shouldShowImagePickerWithMaskPopup
              ? this.showImagePicker(
                  beforeImagePosition,
                  beforeImage ? {uri: beforeImage} : demoImage,
                )
              : this.showGuestUserSignupPopup()
          }
          textToImage={
            isItForFront && isGuestUser ? t('photoDiaryPage.whatsYourAge') : ''
          }
          shouldShowTextToImage={!beforeImage}
          age={beforeAgeBot}
        />
        <ImageWithTitle
          source={{uri: afterImage}}
          title={t('photoDiaryPage.upload')}
          onPress={() =>
            shouldShowImagePickerWithMaskPopup
              ? this.showImagePicker(
                  afterImagePosition,
                  afterImage ? {uri: afterImage} : demoImage,
                )
              : this.showGuestUserSignupPopup()
          }
          age={afterAgeBot}
        />
      </View>
    );
  }

  renderUserRecord = (label, beforeValue, afterValue) => {
    return (
      <View style={styles.userRecordContainer}>
        <View style={styles.userRecordView}>
          <Label style={styles.userRecordTextStyle}>{label}</Label>
        </View>

        <Pressable
          style={styles.userRecordValueView}
          onPress={() => this.showUserRecord(false)}>
          <Label numberOfLines={1} style={styles.userRecordTextStyle}>
            {beforeValue}
          </Label>
        </Pressable>

        <Pressable
          style={styles.userRecordValueView}
          onPress={() => this.showUserRecord(true)}>
          <Label numberOfLines={1} style={styles.userRecordTextStyle}>
            {afterValue}
          </Label>
        </Pressable>
      </View>
    );
  };

  render() {
    const {
      visibleImageUploadLoader,
      uploadProgress,
      visibleUserRecordPanel,
      isItForAfter,
      downloadingImageCollage,
      downloadingPdfCollage,
      visibleCollagePopup,
      visibleOpenPDFPopup,
      pdfPath,
      visibleGuestUserSignupPopup,
      loadingLocalImages,
      visiblePhotoUploadInstructionPopup,
    } = this.state;
    const {
      loading,
      termsAccepted,
      userRecord,
      t,
      navigation,
      contest,
      isGuestUser,
    } = this.props;
    return (
      <View style={styles.container}>
        <LoadingGate loading={isGuestUser ? loadingLocalImages : loading}>
          <ScrollView
            ref={this.scrollViewRef}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.topContent}>
              <Image
                source={ImageSource.camera}
                style={styles.cameraIconStyle}
              />

              <Label
                style={[
                  styles.photoDiaryLabelStyle,
                  isGuestUser && styles.labelCenterStyle,
                ]}>
                {t('photoDiaryPage.photoDiary')}
              </Label>
              {!isGuestUser && (
                <TouchableItem
                  style={styles.photodiaryRuleButtonStyle}
                  onPress={this.showPhotoDiaryRules}>
                  <Label style={styles.rulesLabelStyle}>
                    {t('photoDiaryPage.contestRules')}
                  </Label>
                </TouchableItem>
              )}
            </View>
            <View style={styles.guideContainer}>
              <Label style={styles.photoDiaryGuideLabelStyle}>
                {isGuestUser
                  ? t('photoDiaryPage.photoDiaryRuleMessageForGuestUser')
                  : t('photoDiaryPage.photoDiaryRuleMessage')}
              </Label>
            </View>
            <View style={styles.takingPicMessageContainer}>
              <Label style={styles.takingPicMessageStyle}>
                {t('photoDiaryPage.takingPicMessage')}
              </Label>
              <View style={styles.iconContainerStyle}>
                <Image
                  source={ImageSource.horizontalPhoneIcon}
                  style={styles.horizontalPhoneIconStyle}
                />
                <Image source={ImageSource.okIcon} style={styles.okIconStyle} />
              </View>
              <ImageBackground
                source={ImageSource.verticalPhoneIcon}
                style={styles.verticalPhoneIconStyle}>
                <Image
                  source={ImageSource.refuseIcon}
                  style={styles.refuseIconStyle}
                />
              </ImageBackground>
            </View>

            {!termsAccepted && !isGuestUser && (
              <View style={styles.termsContainer}>
                <Label style={styles.photoUploadRules}>
                  {t('photoDiaryPage.toUploadYouHave')}{' '}
                  <Label
                    onPress={this.showPhotoDiaryRules}
                    style={styles.underlineRule}>
                    {t('photoDiaryPage.overlayRules')}
                  </Label>
                </Label>
              </View>
            )}
            <View style={styles.photoDiaryImagesContainer}>
              <View style={styles.photodiaryHeaderStyle}>
                <Label style={styles.headerTitle}>
                  {t('photoDiaryPage.example')}
                </Label>
                <Label style={styles.headerTitle}>
                  {t('photoDiaryPage.before')}
                </Label>
                <Label style={styles.headerTitle}>
                  {t('photoDiaryPage.after')}
                </Label>
              </View>
              {/*  Front image */}
              {this.renderImageSection(
                t('photoDiaryPage.front'),
                ImageSource.frontView,
                ImageSource.frontMask,
                imagePositionMap.frontViewBefore,
                imagePositionMap.frontViewAfter,
              )}

              {/*  Left 3/4 image */}
              {this.renderImageSection(
                t('photoDiaryPage.3/4Left'),
                ImageSource.left34View,
                ImageSource.left34Mask,
                imagePositionMap.left34ViewBefore,
                imagePositionMap.left34ViewAfter,
              )}

              {/*  Left image */}
              {this.renderImageSection(
                t('photoDiaryPage.leftProfile'),
                ImageSource.leftView,
                ImageSource.leftMask,
                imagePositionMap.leftViewBefore,
                imagePositionMap.leftViewAfter,
              )}

              {/*  Right 3/4 image */}
              {this.renderImageSection(
                t('photoDiaryPage.3/4Right'),
                ImageSource.right34View,
                ImageSource.right34Mask,
                imagePositionMap.right34ViewBefore,
                imagePositionMap.right34ViewAfter,
              )}

              {/*  Right image */}
              {this.renderImageSection(
                t('photoDiaryPage.rightProfile'),
                ImageSource.rightView,
                ImageSource.rightMask,
                imagePositionMap.rightViewBefore,
                imagePositionMap.rightViewAfter,
              )}

              {/*  Back image */}
              {this.renderImageSection(
                t('photoDiaryPage.closeUp'),
                ImageSource.backView,
                ImageSource.backMask,
                imagePositionMap.backViewBefore,
                imagePositionMap.backViewAfter,
              )}
              {!isGuestUser && (
                <>
                  <LinearGradient
                    colors={gradients.header}
                    useAngle
                    angle={0}
                    locations={[0.8, 1]}>
                    {this.renderUserRecord(
                      t('photoDiaryPage.botAge'),
                      Math.round(userRecord[0]?.beforeAgeBoT) || '',
                      Math.round(userRecord[0]?.afterAgeBot) || '',
                    )}
                    {this.renderUserRecord(
                      t('photoDiaryPage.age'),
                      userRecord[0]?.age,
                      userRecord[1]?.age,
                    )}
                    {this.renderUserRecord(
                      t('photoDiaryPage.weight'),
                      userRecord[0]?.weight,
                      userRecord[1]?.weight,
                    )}
                    {this.renderUserRecord(
                      t('photoDiaryPage.height'),
                      userRecord[0]?.height,
                      userRecord[1]?.height,
                    )}
                    {this.renderUserRecord(
                      t('photoDiaryPage.comment'),
                      '...',
                      '...',
                    )}
                  </LinearGradient>
                </>
              )}
              <Pressable
                onPress={
                  isGuestUser ? this.removePhotos : this.showCollagePopup
                }
                style={styles.downloadCollageContainer}>
                <Label style={styles.downloadCollageTextStyle}>
                  {isGuestUser
                    ? t('photoDiaryPage.deleteUploadedPhotos')
                    : t('photoDiaryPage.downloadCollage')}
                </Label>
                <Icon
                  name={
                    isGuestUser
                      ? 'ios-trash-outline'
                      : 'ios-cloud-download-outline'
                  }
                  type="Ionicons"
                  style={styles.downloadIconStyle}
                />
              </Pressable>
              {!termsAccepted && !isGuestUser && (
                <View style={styles.termsOverlay} />
              )}
            </View>
          </ScrollView>
        </LoadingGate>
        <Modal visible={visibleUserRecordPanel}>
          <UserRecord
            t={t}
            ref={this.userRecordRef}
            isItForAfter={isItForAfter}
            onPress={this.hideUserRecord}
            details={{
              beforeAge: userRecord[0]?.age?.toString(),
              afterAge: userRecord[1]?.age?.toString(),
              beforeHeight: userRecord[0]?.height?.toString(),
              afterHeight: userRecord[1]?.height?.toString(),
              beforeWeight: userRecord[0]?.weight?.toString(),
              afterWeight: userRecord[1]?.weight?.toString(),
              beforeComment: userRecord[0]?.comment,
              afterComment: userRecord[1]?.comment,
            }}
          />
        </Modal>

        <ActionSheet
          containerStyle={styles.actionSheetStyle}
          ref={this.actionSheetRef}
          headerAlwaysVisible={true}
          gestureEnabled={true}>
          <Rules />
        </ActionSheet>

        <ImagePickerWithMask
          ref={this.imagePickerRef}
          onImagePicked={this.onImagePicked}
        />
        <ImageConfirmationPopup
          t={t}
          ref={this.imageConfirmationRef}
          onConfirm={this.onConfirmImage}
        />

        <ImageUploadLoader
          t={t}
          visible={visibleImageUploadLoader}
          progress={uploadProgress}
        />

        <CollageDownloadPopup
          t={t}
          visible={visibleCollagePopup}
          hide={this.hideCollagePopup}
          downloadingPdfCollage={downloadingPdfCollage}
          downloadingImageCollage={downloadingImageCollage}
          onPressImageDownloadCollage={this.onPressImageDownloadCollage}
          onPressPDFDownloadCollage={this.onPressPDFDownloadCollage}
          navigation={navigation}
          contest={contest}
        />
        <PDFSuccessfullyDownloadPopup
          t={t}
          visible={visibleOpenPDFPopup}
          hide={this.hideOpenPDFPopup}
          navigation={navigation}
          pdfPath={pdfPath}
        />

        <SetPermission
          ref={this.setPermissionRef}
          title={t('common.enableStorage')}
          message={t('common.allowForCollage')}
        />
        <GuestUserSignupPopup
          t={t}
          visible={visibleGuestUserSignupPopup}
          hide={this.hideGuestUserSignupPopup}
          navigateToSignUpScreen={this._navigateToSignUpScreen}
        />
        <AgeBotPopup ref={this.ageBotRef} t={t} />

        <PhotoUploadInstructionPopup
          t={t}
          visible={visiblePhotoUploadInstructionPopup}
          onRequestClose={this.closePhotoUploadInstructionPopup}
        />
      </View>
    );
  }
}

const mapStateToProps = {
  loading: selectIsGettingImages,
  contest: selectContest,
  contestImages: selectContestImages,
  termsAccepted: selectIsTermsAccepted,
  userRecord: selectUserRecord,
  isGuestUser: selectGuestUser,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps)(PhotoDiary),
);
