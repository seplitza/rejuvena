/**
 * Time Picker Popup
 * @format
 */

import React, {useState} from 'react';
import {View, Modal, TouchableWithoutFeedback} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useTranslation} from '@app/translations';
import {Button, Label} from '@app/components';
import {timePickerPopupStyles as styles} from './styles';

const TimePicker = ({visible, hideTimePicker, setTime}) => {
  const [date, setDate] = useState(new Date());
  const {t} = useTranslation();

  const selectTime = () => {
    setTime(date);
    hide();
  };

  const hide = () => {
    hideTimePicker();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={visible}
      onRequestClose={hide}>
      <View style={styles.container}>
        <Label style={styles.titleStyle}>
          {t('notification.setTheTimeDuration')}
        </Label>
        <View style={styles.dividerStyles} />
        <DatePicker
          date={date}
          mode="time"
          onDateChange={setDate}
          androidVariant="nativeAndroid"
          dividerHeight={5}
        />
        <View style={styles.dividerStyles} />
        <View style={styles.buttonContainerStyles}>
          <Button
            onPress={hide}
            title={t('notification.cancel')}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            enableGradient={false}
          />
          <Button
            onPress={selectTime}
            title={t('notification.okay')}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            enableGradient={false}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.absoluteFill} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export {TimePicker};
