import React, {Component} from 'react';
import {Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {CacheImage, HeaderButton, Icon} from '@app/components';
import {EStyleSheet} from '@app/styles';

class ImageZoom extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false, imageUrl: null};
  }

  open = (imageUrl) => {
    this.setState({visible: true, imageUrl});
  };

  hide = () => {
    this.setState({visible: false});
  };

  render() {
    const {visible, imageUrl} = this.state;
    return (
      <Modal visible={visible} onRequestClose={this.hide}>
        <HeaderButton onPress={this.hide} style={styles.headerButtonStyle}>
          <Icon type="EvilIcons" name="close" style={styles.closeIconStyle} />
        </HeaderButton>
        <ImageViewer
          onCancel={this.hide}
          enableSwipeDown
          imageUrls={[
            {
              url: imageUrl,
            },
          ]}
          renderImage={(props) => <CacheImage {...props} />}
        />
      </Modal>
    );
  }
}

export default ImageZoom;

const styles = EStyleSheet.create({
  headerButtonStyle: {
    position: 'absolute',
    top: '30@ms',
    left: '10@ms',
    zIndex: 1,
  },
  closeIconStyle: {
    fontSize: '30@ms',
    color: '#fff',
  },
});
