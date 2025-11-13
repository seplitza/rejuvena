/**
 * Notification setting
 * @flow
 * @format
 */

import React, {useState} from 'react';
import {Switch, View, Pressable, Text} from 'react-native';
import Collapsible from 'react-native-collapsible';
import dayjs from 'dayjs';
import {connectStructuredSelector} from '@app/utils';
import {Label, Button, Icon} from '@app/components';
import {useTranslation} from '@app/translations';
import {TimePicker} from './time-picker';
import {notificationStyles as styles} from './styles';
import {setNotificationsSettings, getNotificationsSettings} from '../slice';
import {selectNotificationsSettings} from '../selectors';

const DaySelection = ({onSelectDay, selectedDays}) => {
  const {t} = useTranslation();
  const weekDays = [
    t('notification.monday'),
    t('notification.tuesday'),
    t('notification.wednesday'),
    t('notification.thursday'),
    t('notification.friday'),
    t('notification.saturday'),
    t('notification.sunday'),
  ];
  const renderDays = () => {
    return weekDays.map((item, index) => {
      return (
        <Pressable key={index} onPress={() => onSelectDay(index.toString())}>
          <View
            style={[
              styles.dayContainerStyle,
              selectedDays?.includes(index.toString()) &&
                styles.selectedDayContainerStyle,
            ]}>
            {selectedDays?.includes(index.toString()) && (
              <Icon
                name="check"
                type="MaterialIcons"
                style={styles.iconStyle}
              />
            )}
            <Text
              style={[
                styles.dayLabelStyle,
                selectedDays?.includes(index.toString()) &&
                  styles.selectedDayLabelStyle,
              ]}>
              {item}
            </Text>
          </View>
        </Pressable>
      );
    });
  };
  return <View style={styles.weekdayContainerStyle}>{renderDays()}</View>;
};

const Remainders = ({
  title,
  selectedTime,
  toggleSwitch,
  enabled,
  disabled,
  onSelectTime,
  selectedDays,
  onSelectDay,
}) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  return (
    <>
      <View style={styles.remainderContainerStyle}>
        <Label style={styles.labelStyle}>{title}</Label>
        <View style={styles.buttonContainerStyle}>
          <Button
            onPress={() => setTimePickerVisibility(true)}
            title={selectedTime}
            enableGradient={false}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            disabled={!enabled}
          />
          <Switch
            trackColor={{false: 'rgb(170,170,170)', true: '#00259E'}}
            thumbColor={'#ffffff'}
            ios_backgroundColor="rgb(170,170,170)"
            onValueChange={toggleSwitch}
            value={enabled}
            disabled={disabled}
          />
        </View>
      </View>
      {enabled && (
        <DaySelection onSelectDay={onSelectDay} selectedDays={selectedDays} />
      )}

      <TimePicker
        visible={isTimePickerVisible}
        hideTimePicker={() => setTimePickerVisibility(false)}
        setTime={(time) => onSelectTime(dayjs(time).format('HH:mm'))}
      />
    </>
  );
};

class NotificationSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyReminder: true,
      morningReminder: true,
      massageReminder: true,
      morningReminderTime: '07:00',
      massageReminderTime: '07:00',
      morningReminderDays: [],
      massageReminderDays: [],
    };
  }

  componentDidMount() {
    this.props.getNotificationsSettings();
  }

  shouldComponentUpdate(nextProps) {
    const {notificationsSetting} = nextProps;
    if (notificationsSetting !== this.props.notificationsSetting) {
      this.setState({
        dailyReminder: notificationsSetting?.dailyReminder,
        morningReminderTime: dayjs(
          notificationsSetting?.morningReminderTime,
          'HH:mm:ss',
        ).format('HH:mm'),
        massageReminderTime: dayjs(
          notificationsSetting?.massageReminderTime,
          'HH:mm:ss',
        ).format('HH:mm'),
        morningReminderDays: notificationsSetting?.morningReminderDays,
        massageReminderDays: notificationsSetting?.massageReminderDays,
        morningReminder: notificationsSetting?.morningReminder,
        massageReminder: notificationsSetting?.massageReminder,
      });
    }
    return true;
  }

  getFinalSelectedDays = (day, selectedDays = []) => {
    if (selectedDays?.includes(day)) {
      return selectedDays?.filter((_day) => _day !== day);
    }
    return [...selectedDays, day];
  };

  toggleSwitch = () => {
    const {dailyReminder} = this.state;
    this.setState({dailyReminder: !dailyReminder});
  };

  toggleMorningReminderSwitch = () => {
    const {morningReminder} = this.state;
    this.setState({morningReminder: !morningReminder});
  };

  toggleMassageRemainderSwitch = () => {
    const {massageReminder} = this.state;
    this.setState({massageReminder: !massageReminder});
  };

  submitSetting = () => {
    const {
      dailyReminder,
      morningReminder,
      massageReminder,
      morningReminderTime,
      massageReminderTime,
      morningReminderDays,
      massageReminderDays,
    } = this.state;

    this.props.setNotificationsSettings({
      dailyReminder,
      morningReminder,
      massageReminder,
      morningReminderTime,
      massageReminderTime,
      morningReminderDays,
      massageReminderDays,
    });
  };

  render() {
    const {isCollapsed, t} = this.props;
    const {
      dailyReminder,
      morningReminder,
      massageReminder,
      morningReminderTime,
      massageReminderTime,
      massageReminderDays,
      morningReminderDays,
    } = this.state;
    return (
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.container}>
          <View style={styles.headingContainerStyle}>
            <Label style={styles.labelStyle}>
              {t('notification.dailyReminder')}
            </Label>
            <Switch
              trackColor={{false: 'rgb(170,170,170)', true: '#00259E'}}
              thumbColor={'#ffffff'}
              ios_backgroundColor="rgb(170,170,170)"
              onValueChange={this.toggleSwitch}
              value={dailyReminder}
            />
          </View>
          <View style={styles.bottomContainerStyle}>
            <Remainders
              title={t('notification.morningReminder')}
              selectedTime={morningReminderTime}
              enabled={dailyReminder && morningReminder}
              onSelectTime={(time) =>
                this.setState({morningReminderTime: time})
              }
              toggleSwitch={this.toggleMorningReminderSwitch}
              onSelectDay={(day) => {
                this.setState({
                  morningReminderDays: this.getFinalSelectedDays(
                    day,
                    morningReminderDays,
                  ),
                });
              }}
              selectedDays={morningReminderDays}
              disabled={!dailyReminder}
            />
            <Remainders
              title={t('notification.massageReminder')}
              selectedTime={massageReminderTime}
              enabled={dailyReminder && massageReminder}
              onSelectTime={(time) =>
                this.setState({massageReminderTime: time})
              }
              toggleSwitch={this.toggleMassageRemainderSwitch}
              onSelectDay={(day) => {
                this.setState({
                  massageReminderDays: this.getFinalSelectedDays(
                    day,
                    massageReminderDays,
                  ),
                });
              }}
              selectedDays={massageReminderDays}
              disabled={!dailyReminder}
            />
          </View>
        </View>
      </Collapsible>
    );
  }
}

const mapStateToProps = {
  notificationsSetting: selectNotificationsSettings,
};

export default connectStructuredSelector(
  mapStateToProps,
  {
    setNotificationsSettings,
    getNotificationsSettings,
  },
  null,
  {
    forwardRef: true,
  },
)(NotificationSetting);
