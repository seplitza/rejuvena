/**
 * Voting Screen
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {connectStructuredSelector} from '@app/utils';
import {Routes} from '@app/common';
import {withTranslation} from '@app/translations';
import {selectFinalist} from '../selectors';
import {getContestFinalist, voteFinalist} from '../slice';
import {Rules} from './rules';
import ImageViewerComponent from './image-viewer';
import styles from './styles';

class Voting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.actionSheetRef = React.createRef();
  }

  componentDidMount() {
    this.getFinalist();
  }

  getFinalist = () => {
    this.props.getContestFinalist();
  };

  showContestRules = () => {
    this.actionSheetRef.current?.show();
  };

  likeFinalist = (currentIndex) => {
    const {finalist} = this.props;
    const {id, isVoted, totalVote} = finalist[currentIndex] || {};
    this.props.voteFinalist({id, isVoted: !isVoted, totalVote});
  };

  navigateToWinnersScreen = () => {
    this.props.navigation.navigate(Routes.WinnersScreen);
  };

  render() {
    const {finalist, t} = this.props;
    return (
      <>
        <View style={styles.container}>
          <ImageViewerComponent
            t={t}
            finalistAndWinners={finalist}
            isItForFinalist={true}
            showContestRules={this.showContestRules}
            likeFinalist={this.likeFinalist}
            navigateTo={this.navigateToWinnersScreen}
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
  finalist: selectFinalist,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {
    getContestFinalist,
    voteFinalist,
  })(Voting),
);
