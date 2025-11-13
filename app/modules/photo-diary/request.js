/**
 * Contest API Request
 * @flow
 * @format
 */

import {request, endpoints} from '@app/api';
import {showAlert} from '@app/global';
import {getTimezoneOffset, trackEvent} from '@app/utils';

export async function uploadImage(details, image, onUploadProgress) {
  try {
    const {contestId, marathonId, imagePosition, maskType} = details;
    const form: any = new FormData();
    form.append(
      'model',
      JSON.stringify({
        ContestId: contestId,
        ImagePostion: imagePosition,
        MarathonId: marathonId,
        masktype: maskType,
      }),
    );
    form.append('file', {
      name: image.filename || image.path.split('/').pop(),
      type: image.mime,
      uri: image.path,
    });

    const croppedImage = await request.post(
      endpoints.upload_contest_image_mask,
      form,
      {onUploadProgress},
    );
    return croppedImage;
  } catch (e) {
    throw e.message;
  }
}

export async function getAgeBot(image, onUploadProgress) {
  try {
    const form: any = new FormData();
    form.append('file', {
      name: image.filename || image.path.split('/').pop(),
      type: image.mime,
      uri: image.path,
    });

    const getAgeAndCroppedImage = await request.post(
      endpoints.get_age_bot,
      form,
      {
        onUploadProgress,
      },
    );
    trackEvent('Checkout Age Bot Result');
    return getAgeAndCroppedImage;
  } catch (e) {
    showAlert('', e.message);
    throw e;
  }
}

export function getCollageImage(marathonId) {
  return request.get(endpoints.download_collage_image, {
    params: {marathonId, timeZoneOffset: getTimezoneOffset()},
  });
}

export function getCollagePDF(marathonId) {
  return request.get(endpoints.download_collage_pdf, {
    params: {marathonId, timeZoneOffset: getTimezoneOffset()},
  });
}
