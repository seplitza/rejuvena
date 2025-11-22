/**
 * Order List Screen
 * @flow
 * @format
 */

import React, {useEffect} from 'react';
import {View, SectionList, RefreshControl} from 'react-native';
import {
  connectStructuredSelector,
  NavigationService,
  trackEvent,
} from '@app/utils';
import {withTranslation, getLanguage} from '@app/translations';
import {Routes} from '@app/common';
import {Heading, LoadingGate} from '@app/components';
import {colors} from '@app/styles';
import {styles} from './styles';
import {ProductCard} from './product-card';
import {getOrders, purchaseCourse, setScreenParams} from '../slice';
import {selectOrders, selectIsGettingOrders} from '../selectors';

type Props = {
  getOrders: typeof getOrders,
  navigation: any,
  t: Function,
};

const OrderList = (props: Props) => {
  useEffect(() => {
    trackEvent('View MyOrders');
    props.getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {navigation, orders, loading, t} = props;
  const lang = getLanguage();
  const availableCourses = orders?.availableCourses.filter(
    (e) => e?.languageCulture === lang,
  );

  const sectionListData = [
    {
      title: t('orderList.myCourse'),
      data: orders?.currentCourses,
      type: 'active',
    },
    {
      title: t('orderList.availableCourse'),
      data: availableCourses,
      type: 'available',
    },
    {
      title: t('orderList.myArchive'),
      data: orders?.archives,
      type: 'archive',
    },
  ];

  const onPressReadMore = (course) => {
    navigation.navigate(Routes.CourseDescriptionScreen, {
      course,
      isCheckout: false,
    });
  };

  const onPressPurchase = (course) => {
    const {id, isPaid} = course;
    if (!isPaid) {
      props.purchaseCourse({marathonId: id});
      return;
    }
    navigation.navigate(Routes.CourseDescriptionScreen, {
      course,
      isCheckout: true,
    });
  };

  const onPressGoOver = (marathon) => {
    props.setScreenParams({marathonId: marathon.id});
    NavigationService.reset('tabs', {
      screen: Routes.ExerciseScreen,
    });
  };

  return (
    <View style={styles.container}>
      <LoadingGate loading={loading && !orders}>
        <SectionList
          stickySectionHeadersEnabled
          sections={sectionListData}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              colors={[colors.primary]}
              tintColor={colors.primary}
              onRefresh={() => props.getOrders()}
            />
          }
          renderSectionHeader={({section: {title, data}}) => {
            if (data.length) {
              return <Heading title={title} />;
            }
            return null;
          }}
          renderItem={({item, section: {title, type}, index}) => (
            <ProductCard
              t={t}
              marathon={item}
              type={type}
              onPressReadMore={onPressReadMore}
              onPressPurchase={onPressPurchase}
              onPressGoOver={onPressGoOver}
            />
          )}
          renderSectionFooter={() => <View style={styles.separator} />}
        />
      </LoadingGate>
    </View>
  );
};

const mapStateToProps = {
  orders: selectOrders,
  loading: selectIsGettingOrders,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps, {
    getOrders,
    purchaseCourse,
    setScreenParams,
  })(OrderList),
);
