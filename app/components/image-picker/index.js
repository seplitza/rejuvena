/**
 * Image Picker
 * @flow
 * @format
 */

import React from 'react';
import RNImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import * as PermissionHandler from '@app/utils/permission-handler';
import {showAlert} from '@app/global';
import {withTranslation} from '@app/translations';
import {SetPermission} from '@app/components';

type Props = {
  onImagePicked: Function,
  title?: string,
  t: Function,
};

class ImagePickerComponent extends React.Component<Props> {
  static defaultProps = {
    onImagePicked: () => {},
  };

  actionSheetRef = React.createRef();
  blockedPermissionPopupRef = React.createRef();
  pickerOptions;

  showImagePicker(options = {}) {
    this.pickerOptions = options;
    this.actionSheetRef.current?.show();
  }

  onSelectOption = async (optionIndex) => {
    try {
      let image;
      let croppedImage;

      const isTakePhoto = optionIndex === 0;
      if (isTakePhoto) {
        const isCameraPermissionBlocked = await PermissionHandler.isPermissionBlocked(
          PermissionHandler.permissions.camera,
        );
        const isPhotoPermissionBlocked = await PermissionHandler.isPermissionBlocked(
          PermissionHandler.permissions.photo,
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
              t('common.limitedAccess'),
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
    }
  };

  render() {
    const {title, t} = this.props;
    return (
      <>
        <ActionSheet
          ref={this.actionSheetRef}
          title={title}
          options={[
            t('common.takePhoto'),
            t('common.chooseFromGallery'),
            t('common.cancel'),
          ]}
          cancelButtonIndex={2}
          onPress={this.onSelectOption}
        />
        <SetPermission ref={this.blockedPermissionPopupRef} />
      </>
    );
  }
}

export const ImagePicker = withTranslation('', {withRef: true})(
  ImagePickerComponent,
);
