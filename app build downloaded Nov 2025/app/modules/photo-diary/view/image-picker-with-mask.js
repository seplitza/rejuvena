/**
 * Image Picker With Mask
 * @flow
 * @format
 */

import React from 'react';
import RNImagePicker from 'react-native-image-crop-picker';
import {View, Modal, TouchableWithoutFeedback, Pressable} from 'react-native';
import {delay} from '@app/utils';
import {Label, TouchableItem, CacheImage, SetPermission} from '@app/components';
import * as PermissionHandler from '@app/utils/permission-handler';
import {showAlert} from '@app/global';
import {withTranslation} from '@app/translations';
import {EStyleSheet, shadow} from '@app/styles';
import ImageZoom from './image-zoom';

type Props = {
  onImagePicked: Function,
};

type State = {
  visible: boolean,
  mask: any,
};

class ImagePicker extends React.Component<Props, State> {
  static defaultProps = {
    onImagePicked: () => {},
  };

  pickerOptions;

  constructor(props: Props) {
    super(props);
    this.state = {visible: false, mask: null, isImageURI: false};
    this.pickerOptions = {};
    this.imageZoomRef = React.createRef();
    this.blockedPermissionPopupRef = React.createRef();
  }

  showImagePicker(options = {}, mask) {
    let isImageURI = mask.hasOwnProperty('uri');
    this.setState({visible: true, mask, isImageURI});
    this.pickerOptions = options;
  }

  hidePicker = () => {
    this.setState({visible: false});
  };

  onSelectOption = async (optionIndex) => {
    try {
      this.hidePicker();
      await delay(800);
      let image;
      let croppedImage;

      const isTakePhoto = optionIndex === 0;
      if (isTakePhoto) {
        const isCameraPermissionBlocked = await PermissionHandler.isPermissionBlocked(
          PermissionHandler.permissions.camera,
        );
        const isPhotoPermissionBlocked = await PermissionHandler.isPermissionBlocked(
          PermissionHandler.permissions.camera,
        );
        if (isCameraPermissionBlocked || isPhotoPermissionBlocked) {
          this.blockedPermissionPopupRef.current?.show(true);
          return;
        }
        const statuses = await PermissionHandler.requestMultiple([
          PermissionHandler.permissions.camera,
          PermissionHandler.permissions.photo,
        ]);
        const cameraPermission = statuses[PermissionHandler.permissions.camera];
        const photoPermission = statuses[PermissionHandler.permissions.photo];
        if (
          (cameraPermission === PermissionHandler.RESULTS.GRANTED &&
            photoPermission === PermissionHandler.RESULTS.LIMITED) ||
          photoPermission === PermissionHandler.RESULTS.GRANTED
        ) {
          image = await RNImagePicker.openCamera(this.pickerOptions);
        }
      }

      const isPickFromGallery = optionIndex === 1;
      if (isPickFromGallery) {
        const permission = PermissionHandler.permissions.photo;
        const isPermissionBlocked = await PermissionHandler.isPermissionBlocked(
          permission,
        );
        if (isPermissionBlocked) {
          this.blockedPermissionPopupRef.current?.show(false);
          return;
        }
        let result = await PermissionHandler.check(permission);
        if (result === PermissionHandler.RESULTS.LIMITED) {
          const {t} = this.props;
          await new Promise((resolve) => {
            showAlert(
              t('common.changeAccess'),
              t('common.limitedAccessDescription'),
              [
                {
                  title: t('common.keepSame'),
                  onPress: async () => {
                    resolve();
                  },
                },
                {
                  title: t('common.changeAccess'),
                  onPress: async () => {
                    await PermissionHandler.openLimitedPhotoLibraryPicker();
                    resolve();
                  },
                },
                {
                  title: t('common.openSetting'),
                  onPress: () => {
                    PermissionHandler.openSettings();
                  },
                },
              ],
            );
          });
        }
        result = await PermissionHandler.request(permission);
        if (
          result === PermissionHandler.RESULTS.LIMITED ||
          result === PermissionHandler.RESULTS.GRANTED
        ) {
          image = await RNImagePicker.openPicker({});
          if (this.pickerOptions?.cropping) {
            croppedImage = await RNImagePicker.openCropper({
              path: image?.path,
            });
          }
        }
      }
      if (croppedImage) {
        croppedImage && this.props.onImagePicked(croppedImage);
        return;
      }

      image && this.props.onImagePicked(image);
    } catch (e) {
      showAlert('', e.message);
    } finally {
      this.hidePicker();
    }
  };

  renderPickerButton = () => {
    const {t} = this.props;

    return [
      t('common.takePhoto'),
      t('common.chooseFromGallery'),
      t('common.cancel'),
    ].map((name, index) => {
      return (
        <TouchableItem
          onPress={() => this.onSelectOption(index)}
          style={styles.buttonStyle}
          key={index}>
          <Label style={styles.buttonTitle}>{name}</Label>
        </TouchableItem>
      );
    });
  };

  zoomImage = () => {
    const {mask, isImageURI} = this.state;
    isImageURI && this.imageZoomRef.current?.open(mask.uri);
  };

  render() {
    const {visible, mask, isImageURI} = this.state;
    return (
      <>
        <Modal
          visible={visible}
          animationType="fade"
          transparent
          statusBarTranslucent>
          <View style={styles.container}>
            <Pressable onPress={this.zoomImage}>
              <CacheImage
                source={mask}
                style={[styles.avatar, !isImageURI && styles.demoImageStyle]}
              />
            </Pressable>

            {this.renderPickerButton()}
          </View>

          <TouchableWithoutFeedback onPress={this.hidePicker}>
            <View style={styles.absoluteFill} />
          </TouchableWithoutFeedback>
        </Modal>
        <ImageZoom ref={this.imageZoomRef} />
        <SetPermission ref={this.blockedPermissionPopupRef} />
      </>
    );
  }
}

export const ImagePickerWithMask = withTranslation('', {withRef: true})(
  ImagePicker,
);

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '340@ms',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingBottom: '8@ms',
    ...shadow,
    borderRadius: '8@ms',
    borderWidth: 2,
    borderColor: '$colors.darkTextColor',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    alignSelf: 'center',
    resizeMode: 'stretch',
  },
  demoImageStyle: {
    aspectRatio: 0.9,
    width: '90%',
    opacity: 0.8,
  },
  uploadPhotoLabelStyle: {
    color: '$colors.primary',
    textAlign: 'center',
    paddingVertical: '8@ms',
    fontSize: '15@ms',
  },
  absoluteFill: {
    ...EStyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: -1,
  },
  buttonStyle: {
    height: '45@ms',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    ...shadow,
    elevation: 0,
  },
  buttonTitle: {
    color: 'rgb(170,170,170)',
    fontSize: '18@ms',
  },
});
