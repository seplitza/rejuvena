/**
 * Course Description Screen
 * @flow
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Linking,
  Platform,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import * as Animatable from 'react-native-animatable';
import {Shadow} from 'react-native-shadow-2';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isTablet} from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import {Label, Button, LoadingGate, WebView, Icon} from '@app/components';
import {connectStructuredSelector, trackEvent} from '@app/utils';
import {purchaseCourse} from '@app/modules/order-list/slice';
import {EStyleSheet, shadow, gradients, vh} from '@app/styles';
import {withTranslation} from '@app/translations';
import {logout, setNewUser} from '@app/modules/common';
import {ImageSource, Routes} from '@app/common';
import {
  selectIsGettingCourse,
  selectCourseDetail,
  selectIsGettingPlans,
  selectPlans,
  selectShowPaymentCancelPopup,
} from '../selectors';
import {
  getCourseDetail,
  freeCourseUnsubscribe,
  getPlans,
  subscribeToCourse,
  setPaymentCancelPopup,
} from '../slice';
import {addHtmlStyles, addHtmlTitleStyles} from './html-helper';
import {UnsubscribePopup} from './free-course-unsubscribe-popup';
import {AdvancedCourseEligiblePopup} from './advanced-course-eligible-popup';
import {PaymentCancelledPopup} from './payment-cancelled-popup';

type Props = {
  navigation: Object,
};

const perStringEN = {W: 'per week', M: 'per month', Y: ' per year'};
const perStringRU = {W: 'в неделю', M: 'в месяц', Y: 'в год'};

const CourseDescription = (props: Props) => {
  const {
    t,
    loading,
    course,
    navigation,
    route: {params},
    loadingPlans,
    plans,
    showPaymentCancelPopup,
  } = props;
  const {isGuestUser, isCheckout} = params;
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBottomSheet, setBottomSheet] = useState(false);
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const safeInsets = useSafeAreaInsets()?.bottom;
  const actionSheetRef = React.useRef<ActionSheet>(null);

  const [visibleAdvCourseEligiblePopup, setVisibleAdvCourseEligiblePopup] =
    useState(false);

  useEffect(() => {
    trackEvent('View CourseDescription');
    props.getCourseDetail(params.course?.id);
    props.getPlans(params?.course?.id);
    // To re-render on rotate device
    Dimensions.addEventListener('change', () => {
      setHeight(Dimensions.get('window').height);
    });
    //Portrait lock for mobile devices
    !isTablet() && Orientation?.lockToPortrait();
    navigation.dangerouslyGetParent()?.setParams({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent()?.setParams({tabBarVisible: true});
      Orientation.unlockAllOrientations();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openSheet = () => {
    actionSheetRef.current?.show();
  };

  const closeSheet = () => {
    actionSheetRef.current?.hide();
  };

  const checkout = () => {
    const isSubscribe = params?.course?.subscribe;
    const isPaid = params?.course?.isPaid;
    const isFree = params?.course?.isFree;
    const purchaseFreeCourse = !isPaid && !isSubscribe;
    const unsubscribeCourse = !isFree && isSubscribe && !isCheckout;
    const shouldShowFreeCourseUnSubMessage =
      isFree && isSubscribe && !isCheckout;

    if (isGuestUser) {
      props.logout({showSingUpScreen: true});
      props.setNewUser(false);
      return;
    }
    trackEvent('Try Free Subscribe');
    if (purchaseFreeCourse) {
      props.purchaseCourse({marathonId: params.course?.id});
      return;
    }
    trackEvent('Try Unsubscribe Course');
    if (unsubscribeCourse) {
      const subscriptions =
        Platform.OS === 'ios'
          ? 'https://apps.apple.com/account/subscriptions'
          : 'https://play.google.com/store/account/subscriptions';
      Linking.openURL(subscriptions);
      return;
    }
    if (shouldShowFreeCourseUnSubMessage) {
      setVisible(true);
      return;
    }
  };

  const unsubscribe = () => {
    hide();
    props.freeCourseUnsubscribe(params.course?.id);
  };

  const hide = () => setVisible(false);

  const hideAdvCourseEligiblePopup = () =>
    setVisibleAdvCourseEligiblePopup(false);

  const hidePaymentCancelledPopup = () => {
    props.setPaymentCancelPopup(false);
  };

  const navigateToFeedback = () => {
    hidePaymentCancelledPopup();
    navigation.navigate(Routes.UserFeedBackScreen);
  };

  const getButtonTitle = isGuestUser
    ? t('coursePage.registerToSeeMore')
    : params?.course?.subscribe
    ? t('coursePage.unsubscribe')
    : t('coursePage.subscribe');

  let html = addHtmlStyles(course?.description);

  const subscribe = (productId, planId) => {
    if (!params?.course?.isEligibleForAdvancedCourse) {
      setVisibleAdvCourseEligiblePopup(true);
      return;
    }
    props.subscribeToCourse({productId, courseId: params?.course?.id, planId});
    trackEvent('Try Subscribe Course', {productId});
  };

  const getTimeAndPeriod = (subscription) => {
    const perString =
      params?.course?.languageCulture === 'ru' ? perStringRU : perStringEN;
    const {
      subscriptionPeriodNumberIOS,
      subscriptionPeriodUnitIOS,
      subscriptionPeriodAndroid,
    } = subscription;
    if (Platform.OS === 'android') {
      const period = subscriptionPeriodAndroid?.split('')[1];
      const unit = subscriptionPeriodAndroid?.split('')[2];
      if (period > 1) {
        return `${period} ${perString[unit]}`;
      }
      return perString[unit];
    } else if (Platform.OS === 'ios') {
      if (subscriptionPeriodNumberIOS > 1) {
        return `${subscriptionPeriodNumberIOS} ${subscriptionPeriodUnitIOS}`;
      }
      return subscriptionPeriodUnitIOS;
    }
  };

  const _visiblePanel = (index) => {
    setActiveIndex(index);
  };

  const renderPlan = (plan, index) => {
    const {id, subscription, planTitle, planDescription} = plan;
    const {localizedPrice, productId} = subscription || {};
    return (
      <React.Fragment key={productId + index}>
        <Shadow
          radius={{topLeft: 30, topRight: 30}}
          sides={['left', 'right', 'top']}
          viewStyle={styles.planContainer}
          safeRender={true}>
          <Pressable onPress={() => _visiblePanel(index)}>
            <View style={styles.tabContainerStyle}>
              <View style={styles.row}>
                <Icon
                  type="MaterialIcons"
                  name="info-outline"
                  style={styles.iconStyle}
                />
                <Label style={styles.textStyle}>
                  <Label style={styles.priceStyle}>{localizedPrice}</Label>
                  {` ${getTimeAndPeriod(subscription)}`}
                </Label>
              </View>
              <Button
                gradientColors={gradients.btn}
                enableGradient
                containerStyle={styles.subscribeButtonStyle}
                titleStyle={styles.subscribeTitleStyle}
                title={getButtonTitle}
                onPress={() => subscribe(productId, id)}
              />
            </View>
          </Pressable>
        </Shadow>
        {activeIndex === index &&
          renderPlanTitleDescription(planTitle, planDescription)}
      </React.Fragment>
    );
  };

  const renderPlanTitleDescription = (planTitle, planDescription) => {
    const tabletInsets = isTablet() ? 100 : 0;
    let descHeight =
      height - (110 + vh * 7 + safeInsets + tabletInsets + 75 * plans?.length);
    return (
      <View style={styles.planTitleDescContainer}>
        <Animatable.View
          duration={1000}
          animation={'zoomIn'}
          useNativeDriver
          style={[
            styles.padding,
            {
              height: vh * 7,
            },
          ]}>
          <WebView
            source={{
              html: addHtmlTitleStyles(planTitle),
            }}
          />
        </Animatable.View>
        <Animatable.View
          duration={1000}
          useNativeDriver
          animation={'zoomIn'}
          style={[
            styles.padding,
            {
              height: descHeight,
            },
          ]}>
          <WebView
            source={{
              html: addHtmlTitleStyles(planDescription),
            }}
            style={styles.webViewStyle}
            bounces={false}
            nestedScrollEnabled
          />
        </Animatable.View>
      </View>
    );
  };

  const isSubscribe = params?.course?.subscribe;
  const isPaid = params?.course?.isPaid;
  const showPlans = isPaid && !isSubscribe;
  const bottomSafeInsets = safeInsets <= 0 ? 0 : safeInsets - 20;
  const showBottomStrip = !loadingPlans && !showBottomSheet && showPlans;
  return (
    <View style={styles.container}>
      <LoadingGate loading={loading}>
        <WebView source={{html}} />
      </LoadingGate>
      {showPlans ? (
        <LoadingGate loading={loadingPlans}>
          <ActionSheet
            headerAlwaysVisible={true}
            gestureEnabled={true}
            ref={actionSheetRef}
            onOpen={() => setBottomSheet(true)}
            onClose={() => setBottomSheet(false)}
            CustomHeaderComponent={
              <Pressable onPress={closeSheet}>
                <Image
                  source={ImageSource.arrowUp}
                  style={styles.arrowIconStyle}
                />
              </Pressable>
            }>
            {plans?.map((plan, index) => renderPlan(plan, index))}
          </ActionSheet>
        </LoadingGate>
      ) : (
        <View style={styles.buttonContainerStyle}>
          <Button
            gradientColors={gradients.btn}
            enableGradient
            containerStyle={styles.buttonStyle}
            titleStyle={styles.payButtonTitleStyle}
            title={getButtonTitle}
            onPress={checkout}
          />
        </View>
      )}
      <UnsubscribePopup
        t={t}
        visible={visible}
        hide={hide}
        unsubscribe={unsubscribe}
      />
      <AdvancedCourseEligiblePopup
        t={t}
        visible={visibleAdvCourseEligiblePopup}
        hide={hideAdvCourseEligiblePopup}
      />
      <PaymentCancelledPopup
        t={t}
        visible={showPaymentCancelPopup}
        hide={hidePaymentCancelledPopup}
        gotoFeedback={navigateToFeedback}
      />
      {showBottomStrip && (
        <View
          onStartShouldSetResponder={openSheet}
          style={[styles.arrowContainer, {bottom: bottomSafeInsets}]}>
          <Shadow
            radius={{topLeft: 30, topRight: 30}}
            sides={['left', 'right', 'top']}
            viewStyle={styles.shadowContainer}
            safeRender={true}>
            <Animatable.Image
              animation="bounce"
              easing="ease-out"
              duration={4000}
              iterationCount="infinite"
              source={ImageSource.arrowUp}
              style={styles.arrowIconStyle}
            />
            <Label style={styles.seePlanCaptionStyle}>
              {t('coursePage.seePlanCaption')}
            </Label>
          </Shadow>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = {
  loading: selectIsGettingCourse,
  course: selectCourseDetail,
  loadingPlans: selectIsGettingPlans,
  plans: selectPlans,
  showPaymentCancelPopup: selectShowPaymentCancelPopup,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {
    getCourseDetail,
    purchaseCourse,
    logout,
    setNewUser,
    freeCourseUnsubscribe,
    getPlans,
    subscribeToCourse,
    setPaymentCancelPopup,
  })(CourseDescription),
);

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonStyle: {
    width: null,
    height: null,
    minHeight: '70@ms',
    minWidth: '250@ms',
    borderRadius: '10@ms',
    alignSelf: 'center',
    marginVertical: '10@ms',
    ...shadow,
  },
  payButtonTitleStyle: {
    color: '#fff',
    fontSize: '42@ms',
    textAlign: 'center',
    padding: '10@ms',
  },
  buttonContainerStyle: {
    backgroundColor: '#fff',
    borderTopColor: '$colors.secondaryTextColor',
    borderTopWidth: 1,
  },
  tabContainerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '18@ms',
    fontFamily: '$fonts.HelveticaNeueBold',
  },
  subscribeButtonStyle: {
    width: null,
    height: null,
    borderRadius: '10@ms',
    alignSelf: 'center',
    marginTop: '8@ms',
    ...shadow,
  },
  subscribeTitleStyle: {
    color: '#fff',
    fontSize: '16@ms',
    textAlign: 'center',
    padding: '8@ms',
    fontFamily: '$fonts.DINCondRegular',
  },
  textStyle: {
    color: 'rgb(0,25,107)',
    fontSize: '15@ms',
    fontFamily: '$fonts.HelveticaNeue',
  },
  planTitleDescContainer: {
    paddingTop: '10@ms',
  },
  iconStyle: {
    fontSize: '25@ms',
    color: 'rgb(0,25,107)',
    paddingHorizontal: '5@ms',
  },
  webViewStyle: {
    marginVertical: '15@ms',
  },
  padding: {
    paddingHorizontal: '10@ms',
  },
  row: {
    flexDirection: 'row',
  },
  planContainer: {
    width: '100%',
    height: '60@ms',
    padding: '6@ms',
  },
  arrowContainer: {
    width: '100%',
    zIndex: 2,
    backgroundColor: '#fff',
  },
  shadowContainer: {
    width: '100%',
  },
  arrowIconStyle: {
    resizeMode: 'contain',
    marginVertical: '10@ms',
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
  },
  seePlanCaptionStyle: {
    paddingBottom: '4@ms',
    textAlign: 'center',
    fontSize: '18@ms',
    color: 'rgb(250, 197, 28)',
  },
});
