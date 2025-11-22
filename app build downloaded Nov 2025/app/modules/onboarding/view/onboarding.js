/**
 * OnBoarding Screen
 * @flow
 * @format
 */

import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';
import Orientation from 'react-native-orientation-locker';
import {Label, Container, Button} from '@app/components';
import {Strings, Routes, ImageSource} from '@app/common';
import {setNewUser} from '@app/modules/common';
import {styles} from './styles';

const {onboarding, common} = Strings;
class OnBoarding extends Component {
  constructor(props) {
    super(props);
    this.swiperRef = React.createRef();
    this.state = {activeIndex: 0};
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // this locks the view to Portrait Mode
      Orientation?.lockToPortrait();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  goToSignUp = () => {
    this.props.navigation.navigate(Routes.SignUpScreen);
    this.props.setNewUser(false);
  };

  renderContent = (heading, caption, image) => {
    return (
      <View style={styles.contentStyle}>
        <View>
          <Label style={styles.headingStyle}>{heading}</Label>
          <Label style={styles.captionStyle}>{caption}</Label>
        </View>
        <Image source={image} style={styles.imageStyle} />
        <View style={styles.buttonContainer}>
          <Button
            title={common.signUp}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={this.goToSignUp}
          />
          <Button
            title={common.continue}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={this.nextButton}
          />
        </View>
      </View>
    );
  };

  nextButton = () => {
    const {activeIndex} = this.state;
    if (activeIndex === 4) {
      this.goToSignUp();
      return;
    }
    this.swiperRef.current?.scrollBy(1);
  };

  render() {
    return (
      <Container style={styles.container}>
        <Swiper
          ref={this.swiperRef}
          loop={false}
          autoplay
          autoplayTimeout={5}
          paginationStyle={styles.paginationStyle}
          dot={<View style={styles.dotStyle} />}
          activeDot={<View style={styles.activeDotStyle} />}
          onIndexChanged={(index) => this.setState({activeIndex: index})}>
          {this.renderContent(
            onboarding.rejuvenation,
            onboarding.rejuvenationCaption,
            ImageSource.beforeAfter,
          )}
          {this.renderContent(
            onboarding.basicAdvLevel,
            onboarding.basicAdvLevelCaption,
            ImageSource.lymphDrained,
          )}
          {this.renderContent(
            onboarding.naturalSystem,
            onboarding.naturalSystemCaption,
            ImageSource.posture,
          )}
          {this.renderContent(
            onboarding.faceliftMassages,
            onboarding.faceliftMassagesCaption,
            ImageSource.massages,
          )}
          {this.renderContent(
            onboarding.freePractice,
            onboarding.freePracticeCaption,
            ImageSource.advCourses,
          )}
          {/* {this.renderContent(
            onboarding.naturalFacelift,
            onboarding.naturalFaceliftCaption,
            ImageSource.naturalFacelift,
          )} */}
        </Swiper>
      </Container>
    );
  }
}

export default connect(null, {setNewUser})(OnBoarding);
