/**
 * Open PDF Screen
 * @flow
 * @format
 */

import React, {useState} from 'react';
import PDFView from 'react-native-view-pdf';
import {EStyleSheet} from '@app/styles';
import {trackEvent} from '@app/utils';
import {Loader} from '@app/components';

const ViewPDFScreen = ({route}) => {
  const [loading, setLoading] = useState(true);
  const resources = {
    url: route.params?.pdfPath,
  };
  const resourceType = 'url';
  trackEvent('VIEW_PDF_SCREEN');
  return (
    <>
      <PDFView
        fadeInDuration={250.0}
        style={styles.pdfStyle}
        resource={resources[resourceType]}
        resourceType={resourceType}
        onLoad={() => setLoading(false)}
      />
      <Loader visible={loading} style={styles.loaderStyle} />
    </>
  );
};

export default ViewPDFScreen;

const styles = EStyleSheet.create({
  loaderStyle: {
    ...EStyleSheet.absoluteFill,
  },
  pdfStyle: {
    flex: 1,
  },
});
