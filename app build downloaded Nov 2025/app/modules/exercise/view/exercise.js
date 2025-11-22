import React from 'react';
import {View, ScrollView, Dimensions, RefreshControl} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {connectStructuredSelector, trackEvent} from '@app/utils';
import {getMarathon} from '../slice';
import {
  selectIsGettingMarathon,
  selectMarathon,
  selectCurrentMarathonId,
  selectIsTermsAccepted,
  selectIsStartSelected,
} from '../selectors';
import {LoadingGate, Header} from '@app/components';
import {selectGuestUser} from '@app/modules/common';
import ExerciseHeader from './exercise-header';
import {selectScreenParams, setScreenParams} from '@app/modules/order-list';
import ExerciseDescription from './exercise-description';
import ExerciseRules from './exercise-rules';
import TermsNotAcceptedPopup from './terms-not-accepted-popup';
import ExerciseDays from './exercise-days';
import DayPlan from './day-plan';
import TrailInformationPanel from './trail-information-panel';
import {styles, contentContainerStyle} from './styles';

class Exercise extends React.Component<Props, State> {
  mounted = false;
  constructor(props) {
    super(props);
    this.bellAnimationRef = React.createRef();
    this.marathonDayRef = React.createRef();
    const {screenParams} = this.props;
    this.state = {
      loading: true,
      width: 0,
      isTermsAccepted: true,
      shouldShowRegulation: true,
      screenParams,
    };
  }

  componentDidMount() {
    trackEvent('View StartCourseScreen');
    // To re-render on rotate device
    Dimensions.addEventListener('change', () => {
      this.setState({width: Dimensions.get('screen').width});
    });

    this.mounted = true;
    this.getData();
    this.props.setScreenParams(null);
  }

  getData = () => {
    const {screenParams, currentMarathonId} = this.props;
    this.props.getMarathon(screenParams?.marathonId || currentMarathonId);
  };

  scrollToTop = () => {
    this.props.scrollRef?.current?.scrollTo({x: 0, y: 0, animated: true});
  };

  onPressDay = () => {
    this.scrollToTop();
  };

  isTermsAccepted() {
    return this.props.termsAccepted;
  }

  shouldShowRegulation() {
    return this.props.isStartSelected || !this.isTermsAccepted();
  }

  shouldShowDayPlan() {
    return this.isTermsAccepted();
  }

  onRefresh = () => {
    this.getData();
  };

  render() {
    const {loading, navigation, marathon, scrollRef} = this.props;
    const {screenParams} = this.state;
    const isTermsAccepted = this.isTermsAccepted();
    const visibleTrailInfoPanel = screenParams?.isTrail === true && !!marathon;
    const shouldShowStartPage = screenParams?.shouldShowStartPage;
    const visibleDemoMessagePanel =
      screenParams?.showDemoCourseMessage === true && !!marathon;
    return (
      <>
        <Header title={'Natural Rejuvenation'} canAccessDrawer />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={contentContainerStyle()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.onRefresh}
              colors={[styles.refreshControl.color]}
              tintColor={styles.refreshControl.color}
            />
          }>
          <LoadingGate loading={!(this.mounted && !loading)}>
            <ExerciseHeader />
            <ExerciseDescription />
            {this.shouldShowRegulation() && <ExerciseRules />}
            {this.shouldShowDayPlan() && <DayPlan navigation={navigation} />}
            <View
              style={[
                styles.marathonDaysContainer,
                !isTermsAccepted && styles.termsNotAcceptedMinHeight,
              ]}>
              <ExerciseDays
                ref={this.marathonDayRef}
                onPressDay={this.onPressDay}
                navigation={navigation}
                shouldShowStartPage={shouldShowStartPage}
                refresh={this.getData}
              />
              {!isTermsAccepted && <TermsNotAcceptedPopup />}
            </View>
          </LoadingGate>
        </ScrollView>
        {(visibleTrailInfoPanel || visibleDemoMessagePanel) && (
          <TrailInformationPanel
            title={marathon?.title}
            isDemoCourse={visibleDemoMessagePanel}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = {
  loading: selectIsGettingMarathon,
  marathon: selectMarathon,
  currentMarathonId: selectCurrentMarathonId,
  termsAccepted: selectIsTermsAccepted,
  isStartSelected: selectIsStartSelected,
  isGuestUser: selectGuestUser,
  screenParams: selectScreenParams,
};

//Wrap component
const ExerciseScreen = (props) => {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <Exercise {...props} scrollRef={ref} />;
};

export default connectStructuredSelector(mapStateToProps, {
  getMarathon,
  setScreenParams,
})(ExerciseScreen);
