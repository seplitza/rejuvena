/**
 * Winners Screen
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {connectStructuredSelector} from '@app/utils';
import {getContestWinners, voteFinalist} from '../slice';
import {withTranslation} from '@app/translations';
import {selectWinners} from '../selectors';
import {Rules} from './rules';
import {Routes} from '@app/common';
import ImageViewerComponent from './image-viewer';
import styles from './styles';

class Winners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.actionSheetRef = React.createRef();
  }

  componentDidMount() {
    this.getWinners();
  }

  getWinners = () => {
    this.props.getContestWinners();
  };

  showContestRules = () => {
    this.actionSheetRef.current?.show();
  };

  navigateToVotingScreen = () => {
    this.props.navigation.navigate(Routes.VotingScreen);
  };

  render() {
    const {winners, t} = this.props;
    return (
      <>
        <View style={styles.container}>
          <ImageViewerComponent
            t={t}
            finalistAndWinners={winners}
            isItForFinalist={false}
            showContestRules={this.showContestRules}
            navigateTo={this.navigateToVotingScreen}
          />
        </View>
        <ActionSheet
          containerStyle={styles.actionSheetStyle}
          ref={this.actionSheetRef}
          headerAlwaysVisible={true}
          gestureEnabled={true}>
          <Rules />
        </ActionSheet>
      </>
    );
  }
}

const mapStateToProps = {
  winners: selectWinners,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {
    getContestWinners,
    voteFinalist,
  })(Winners),
);
