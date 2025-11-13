/**
 * Description Comment Tab Screen
 * @flow
 * @format
 */

import React, {Component} from 'react';
import {View, ScrollView, Image, Pressable, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Label, TouchableItem} from '@app/components';
import {connectStructuredSelector} from '@app/utils';
import {withTranslation} from '@app/translations';
import {ImageSource} from '@app/common';
import {gradients} from '@app/styles';
import {selectCourseLanguage} from '../selectors';
import {
  descriptionCommentTabStyles as styles,
  contentContainerStyle,
} from './styles';
import {ExerciseDetail} from './exercise-detail';
import Description from './description';
import FAQ from './faq';

class DescriptionCommentTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: props.route?.params.activeTabIndex,
      shouldShowTab: true,
      width: 0,
    };
  }

  componentDidMount() {
    // To re-render on rotate device
    Dimensions.addEventListener('change', () => {
      this.setState({width: Dimensions.get('screen').width});
    });
    this.props.navigation
      .dangerouslyGetParent()
      ?.setParams({tabBarVisible: false});
  }

  componentWillUnmount() {
    this.props.navigation
      .dangerouslyGetParent()
      ?.setParams({tabBarVisible: true});
  }

  showTab = () => {
    this.setState({shouldShowTab: false});
  };

  hideTab = () => {
    this.setState({shouldShowTab: true});
  };

  render() {
    const {exercise} = this.props.route?.params;
    const {id, exerciseName} = exercise || {};
    const {activeTabIndex, shouldShowTab} = this.state;
    const {t, courseLanguage} = this.props;
    const descriptionIcon =
      courseLanguage === 'ru'
        ? ImageSource.ruDescriptionIcon
        : ImageSource.enDescriptionIcon;
    return (
      <View style={styles.containerStyle}>
        {activeTabIndex === 0 && (
          <ScrollView
            ref={this.scrollViewRef}
            nestedScrollEnabled={true}
            contentContainerStyle={contentContainerStyle()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>
            <ExerciseDetail exercise={exercise} index={0} />
            <Pressable style={styles.descriptionHeader}>
              <LinearGradient
                locations={[0, 0.06, 0.94, 1]}
                colors={gradients.description}
                style={styles.absoluteFill}
              />
              <Image source={descriptionIcon} style={styles.imageStyle} />
              <Label style={styles.descriptionHeaderTitleStyle}>
                {exerciseName}
              </Label>
            </Pressable>
            <Description exercise={exercise} />
          </ScrollView>
        )}
        {activeTabIndex === 1 && (
          <FAQ exerciseId={id} showTab={this.showTab} hideTab={this.hideTab} />
        )}
        {shouldShowTab && (
          <View style={styles.tabContainerStyle}>
            {[
              t('userMarathonDailyExercisePage.description'),
              t('userMarathonDailyExercisePage.questionAns'),
            ].map((item, index) => {
              return (
                <TouchableItem
                  disabled={index === activeTabIndex}
                  onPress={() => this.setState({activeTabIndex: index})}
                  key={index}
                  style={[
                    styles.tabStyle,
                    index !== activeTabIndex && styles.opacity,
                  ]}>
                  <>
                    <Image
                      source={
                        index === 0
                          ? ImageSource.description
                          : ImageSource.quesAns
                      }
                      style={styles.tabIconStyle}
                      resizeMode={'contain'}
                    />
                    <Label numberOfLines={1} style={styles.tabTitleStyle}>
                      {item}
                    </Label>
                  </>
                </TouchableItem>
              );
            })}
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = {
  courseLanguage: selectCourseLanguage,
};

export default withTranslation()(
  connectStructuredSelector(mapStateToProps)(DescriptionCommentTab),
);
