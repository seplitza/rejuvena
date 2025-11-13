/**
 * Guest User Screen
 * @flow
 * @format
 */

import React, {useEffect} from 'react';
import {View, Image, FlatList, Pressable, ImageBackground} from 'react-native';
import {connectStructuredSelector} from '@app/utils';
import {
  Label,
  Button,
  LoadingGate,
  CacheImage,
  Icon,
  HeaderButton,
} from '@app/components';
import {useTranslation, getLanguage} from '@app/translations';
import {ImageSource, Routes} from '@app/common';
import {AuthContainer} from './auth-container';
import {getGuestUserMarathon} from '../slice';
import {purchaseCourse} from '@app/modules/order-list/slice';
import {
  selectIsGettingGuestUserCourses,
  selectGuestUserCourses,
} from '../selectors';
import {guestUserStyles as styles} from './styles';

type Props = {
  loading: boolean,
  guestUserCourses: Array<Object>,
  navigation: any,
};

const GuestUser = (props: Props) => {
  useEffect(() => {
    props.getGuestUserMarathon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {guestUserCourses, loading, navigation} = props;
  const selectedLanguage = getLanguage();
  const {t} = useTranslation();

  const showDescriptionOfCourse = (item, isDemoCourse) => {
    if (isDemoCourse) {
      _purchaseCourse();
    } else {
      navigation.navigate(Routes.CourseDescriptionScreen, {
        course: item,
        isGuestUser: true,
      });
    }
  };

  const availableCourses = guestUserCourses?.filter(
    (e) => e.languageCulture === selectedLanguage,
  );

  const getDemoCourse = availableCourses?.filter((e) => e?.isDemoCourse);

  const _purchaseCourse = () => {
    props.purchaseCourse({marathonId: getDemoCourse?.[0]?.id});
  };

  const renderCourse = ({item}) => {
    return (
      <Pressable
        style={[
          styles.courseImageContainerStyle,
          !item?.isDemoCourse && styles.borderStyle,
        ]}
        onPress={() => showDescriptionOfCourse(item, item?.isDemoCourse)}>
        <CacheImage
          loaderShown
          source={{uri: item?.imagePath}}
          style={
            item?.isDemoCourse
              ? styles.demoCourseIconStyle
              : styles.courseIconStyle
          }
          placeholderSource={ImageSource.imagePlaceholder}
        />
        {!item?.isDemoCourse && (
          <View>
            <Label style={styles.titleStyle}>{item?.title}</Label>
            <Label style={styles.subTitleStyle}>{item?.subTitle}</Label>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <AuthContainer>
      <HeaderButton
        style={styles.drawerButtonStyle}
        onPress={() => navigation.openDrawer()}>
        <Icon type="Feather" name="menu" style={styles.drawerIconStyle} />
      </HeaderButton>
      <View style={styles.guestMessageAndImageStyle}>
        <Image source={ImageSource.agePlaceholder} style={styles.imageStyle} />
        <Label style={styles.messageStyle}>
          {t('guestUserPage.whatAgeYourFace')}
        </Label>
        <Label style={styles.messageStyle}>
          {t('guestUserPage.checkAgeWithBot')}
        </Label>
        <Label style={[styles.messageStyle, styles.marginTop]}>
          {t('guestUserPage.wantTo')}
          <Label
            onPress={() => navigation.navigate(Routes.PhotoDiaryScreen)}
            style={styles.boldMessageStyle}>
            {t('guestUserPage.check')}
          </Label>
          {t('guestUserPage.now')}
        </Label>
      </View>
      <View style={styles.guestMessageAndImageStyle}>
        <ImageBackground
          source={ImageSource.collageWinner}
          style={styles.imageStyle}>
          <Image
            source={ImageSource.winnerCup}
            style={styles.winnerCupIconStyle}
            resizeMode={'contain'}
          />
        </ImageBackground>
        <Label style={styles.messageStyle}>
          {t('guestUserPage.checkResult')}
        </Label>
        <Label
          numberOfLines={1}
          onPress={() => navigation.navigate(Routes.VotingScreen)}
          style={styles.boldMessageStyle}>
          {t('guestUserPage.likeAchievement')}
        </Label>
        <Label style={styles.messageStyle}>
          {t('guestUserPage.helpToWin')}
        </Label>
      </View>
      <Label style={styles.availableCourseStyle}>
        {t('guestUserPage.availableCourses')}
      </Label>
      <LoadingGate loading={loading}>
        <FlatList
          data={availableCourses?.reverse()}
          renderItem={renderCourse}
          keyExtractor={(item) => item?.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.courseListStyle}
        />
      </LoadingGate>
      <Button
        title={t('guestUserPage.goToDemoCourse')}
        containerStyle={styles.buttonContainerStyle}
        titleStyle={styles.buttonTitleStyle}
        onPress={_purchaseCourse}
        disabled={loading}
      />
    </AuthContainer>
  );
};

const mapStateToProps = {
  loading: selectIsGettingGuestUserCourses,
  guestUserCourses: selectGuestUserCourses,
};

export default connectStructuredSelector(mapStateToProps, {
  getGuestUserMarathon,
  purchaseCourse,
})(GuestUser);
