/**
 * Product Card
 * Using for available my order list
 * @flow
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import {ImageSource} from '@app/common';
import {withTranslation} from '@app/translations';
import {Card, Label, Button, CacheImage} from '@app/components';

import {styles} from './styles';

type Props = {
  marathon: Object,
  onPressPurchase: Function,
  onPressReadMore: Function,
  onPressGoOver: Function,
  type: 'active' | 'archive' | 'available',
};

class ProductCardComponent extends React.Component<Props> {
  attachMarathonAndCall = (callBack) => {
    callBack(this.props.marathon);
  };

  renderButton = () => {
    const {type, onPressPurchase, onPressGoOver, marathon, t} = this.props;
    const isRussianCourse = marathon?.languageCulture === 'ru';
    const isSpanishCourse = marathon?.languageCulture === 'es';

    const goOver = isRussianCourse
      ? 'Перейти'
      : isSpanishCourse
      ? 'Ir al Curso'
      : 'GO OVER';

    // My order list screen - marathons available for purchase
    if (type === 'available') {
      return (
        <Button
          containerStyle={styles.joinButtonStyle}
          titleStyle={styles.joinButtonLabelStyle}
          title={t('orderList.join')}
          onPress={() => this.attachMarathonAndCall(onPressPurchase)}
          enableGradient
        />
      );
    }

    // If user purchased marathon and its currently active
    if (type === 'active') {
      return (
        <Button
          containerStyle={styles.joinButtonStyle}
          titleStyle={styles.joinButtonLabelStyle}
          title={goOver}
          onPress={() => this.attachMarathonAndCall(onPressGoOver)}
          enableGradient
        />
      );
    }
  };

  render() {
    const {marathon, onPressReadMore} = this.props;
    const {
      imagePath,
      title,
      subTitle,
      isOutDated,
      isPaid,
      languageCulture,
      courseType,
      days,
      cost,
    } = marathon;
    const isRussianCourse = languageCulture === 'ru';
    const isSpanishCourse = languageCulture === 'es';
    const threeDaysTrailPeriod = isRussianCourse
      ? 'Попробуй 30+ дня бесплатно!!!'
      : isSpanishCourse
      ? 'Período de prueba de 30+ días / PRUEBA GRATIS!!!'
      : '30+ days trial period / TRY FOR FREE!!!';
    const trailPeriod = isRussianCourse
      ? 'Попробуй совершенно бесплатно!'
      : isSpanishCourse
      ? 'PRUÉBALO GRATIS!!!'
      : 'TRY IT FOR FREE!!!';
    const learnMore = isRussianCourse
      ? 'Подробнее'
      : isSpanishCourse
      ? 'Aprende más'
      : 'Learn more';
    const startFrom = isRussianCourse
      ? `Подписки от ${cost} рублей`
      : isSpanishCourse
      ? `A partir de $${cost}`
      : `Starting from $${cost}`;
    const studyPracticeDays = isRussianCourse
      ? `${days} дней обучения + курсы практики`
      : isSpanishCourse
      ? `${days} días de educación + cursos de práctica`
      : `${days}  days of education + practice courses`;
    const advancedCourse = courseType?.includes('MiyabiADVANCEDSSC');
    return (
      <Card style={styles.cardStyle}>
        <View style={styles.cartContent}>
          <View style={styles.topSection}>
            <CacheImage
              placeholderSource={ImageSource.imagePlaceholder}
              source={{uri: imagePath}}
              style={styles.imageStyle}
            />

            <View style={styles.detailSection}>
              {/*======[ Course Title ]======= */}
              <Label style={styles.boldTextStyle} numberOfLines={2}>
                {title}
              </Label>
              {/*======[ Course Sub Title  ]======= */}
              <Label style={styles.textStyle} numberOfLines={2}>
                {subTitle}
              </Label>

              {/*======[ Duration ]======= */}

              <Label style={styles.textStyle}>{studyPracticeDays}</Label>

              {/*======[ Cost ]======= */}

              {isPaid && <Label style={styles.textStyle}>{startFrom}</Label>}

              {/*======[ Trial ]======= */}
              {!advancedCourse && (
                <Label style={styles.textStyle}>
                  {isPaid ? threeDaysTrailPeriod : trailPeriod}
                </Label>
              )}
            </View>
          </View>

          <View style={styles.bottomSection}>
            {this.renderButton()}

            {/*
              In outdated marathon, marathon description not available
              so we should not show detail button if marathon outdated
          */}
            {!isOutDated && (
              <Button
                enableGradient={false}
                containerStyle={styles.learnMoreButtonStyle}
                titleStyle={styles.learMoreText}
                title={learnMore}
                onPress={() => this.attachMarathonAndCall(onPressReadMore)}
              />
            )}
          </View>
        </View>
      </Card>
    );
  }
}

export const ProductCard = withTranslation()(ProductCardComponent);
