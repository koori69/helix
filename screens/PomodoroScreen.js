import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, WhiteSpace, WingBlank, Picker } from 'antd-mobile';
import { Notifications } from 'expo';
import Circle from '../components/Circle';

const data = [
  [
    {
      label: '10',
      value: '10',
    },
    {
      label: '15',
      value: '15',
    },
    {
      label: '20',
      value: '20',
    },
    {
      label: '25',
      value: '25',
    },
    {
      label: '30',
      value: '30',
    },
    {
      label: '40',
      value: '40',
    },
    {
      label: '45',
      value: '45',
    },
    {
      label: '50',
      value: '50',
    },
    {
      label: '55',
      value: '55',
    },
    {
      label: '60',
      value: '60',
    },
    {
      label: '65',
      value: '65',
    },
  ],
  [
    {
      label: '00',
      value: '00',
    },
    {
      label: '10',
      value: '10',
    },
    {
      label: '15',
      value: '15',
    },
    {
      label: '20',
      value: '20',
    },
    {
      label: '25',
      value: '25',
    },
    {
      label: '30',
      value: '30',
    },
    {
      label: '35',
      value: '35',
    },
    {
      label: '40',
      value: '40',
    },
    {
      label: '45',
      value: '45',
    },
    {
      label: '50',
      value: '50',
    },
    {
      label: '55',
      value: '55',
    },
  ],
];
const START = 'Start';
const STOP = 'Stop';
const POMODORO_STATUS = {
  READY: 'READY',
  FOCUS: 'FOCUS',
  BREAK: 'BREAK',
  FOCUS_STOP: 'FOCUS_STOP',
  BREAK_READY: 'BREAK_READY',
  BREAK_STOP: 'BREAK_STOP',
};

export default class PomodoroScreen extends Component {
  static navigationOptions = {
    title: 'Pomodoro',
  };

  constructor(props) {
    super(props);
    this.state = {
      pickerTime: ['10', '00'],
      value: null,
      startTime: null,
      endTime: null,
      countdownTime: ['00', '10'],
      status: POMODORO_STATUS.READY,
      btnText: START,
      pickerDisabled: false,
    };
  }

  onPickerOk = async (value) => {
    this.setState({ countdownTime: value });
  };

  preZeroFill(num, size) {
    if (num >= Math.pow(10, size)) {
      return num.toString();
    } else {
      const str = Array(size + 1).join('0') + num;
      return str.slice(str.length - size);
    }
  }

  count=() => {
    const { endTime, status } = this.state;
    const now = new Date().getTime();
    const ms = endTime - now;
    if (ms <= 0) {
      const statusTxt = status === POMODORO_STATUS.FOCUS ? POMODORO_STATUS.BREAK_READY : POMODORO_STATUS.READY;
      clearInterval(this.state.timer);
      this.setState({ status: statusTxt, countdownTime: ['00', '10'], btnText: START, pickerDisabled: false });
      return;
    }
    const minutesRemaining = Math.floor(ms / 1000 / 60);
    const secondsRemaining = Math.round(ms / 1000 - minutesRemaining * 60);
    const countdownTime = [this.preZeroFill(minutesRemaining, 2), this.preZeroFill(secondsRemaining, 2)];
    this.setState({ countdownTime });
  };

  focusStart= async () => {
    const { countdownTime } = this.state;
    const startTime = new Date().getTime();
    const endTime = startTime + ((parseInt(countdownTime[0]) * 60 + parseInt(countdownTime[1])) * 1000);
    const notify = await Notifications.scheduleLocalNotificationAsync(
      {
        title: 'Pomodoro is over!',
        body: 'Ready to have a break?',
        ios: {
          sound: true,
        },
        android: {
          vibrate: true,
        },
      },
      {
        time: endTime,
      },
    );

    const timer = setInterval(this.count, 1000);
    this.setState({ endTime, notify, timer });
  };

  stop=() => {
    const { notify, timer } = this.state;
    Notifications.cancelScheduledNotificationAsync(notify);
    clearInterval(timer);
  };

  breakStart= async () => {
    const { countdownTime } = this.state;
    const startTime = new Date().getTime();
    const endTime = startTime + ((parseInt(countdownTime[0]) * 60 + parseInt(countdownTime[1])) * 1000);
    const notify = await Notifications.scheduleLocalNotificationAsync(
      {
        title: 'Break is over!',
        body: 'Ready to start another Pomodoro?',
        ios: {
          sound: true,
        },
        android: {
          vibrate: true,
        },
      },
      {
        time: endTime,
      },
        );

    const timer = setInterval(this.count, 1000);
    this.setState({ endTime, notify, timer });
  };

  handleContinueClick = () => {
    const { status } = this.state;
    switch (status) {
      case POMODORO_STATUS.READY:
        this.setState({ status: POMODORO_STATUS.FOCUS, pickerDisabled: true });
        this.focusStart();
        break;
      case POMODORO_STATUS.FOCUS:
        this.setState({ status: POMODORO_STATUS.FOCUS_STOP, pickerDisabled: false });
        this.stop();
        break;
      case POMODORO_STATUS.FOCUS_STOP:
        this.setState({ status: POMODORO_STATUS.FOCUS, pickerDisabled: true });
        this.focusStart();
        break;
      case POMODORO_STATUS.BREAK_READY:
        this.setState({ status: POMODORO_STATUS.BREAK, pickerDisabled: true });
        this.breakStart();
        break;
      case POMODORO_STATUS.BREAK:
        this.setState({ status: POMODORO_STATUS.BREAK_STOP, pickerDisabled: false });
        this.stop();
        break;
      default:
    }
  };

  resetTime = () => {
    this.setState({ countdownTime: ['10', '00'] });
  };

  handleResetClick = () => {
    const { status } = this.state;
    switch (status) {
      case POMODORO_STATUS.FOCUS_STOP:
        this.setState({ status: POMODORO_STATUS.READY, pickerDisabled: true });
        this.resetTime();
        break;
      case POMODORO_STATUS.BREAK_STOP:
        this.setState({ status: POMODORO_STATUS.READY, pickerDisabled: true });
        this.resetTime();
        break;
      default:
    }
  };

  displayButton=() => {
    const { status } = this.state;
    switch (status) {
      case POMODORO_STATUS.READY:
        return (
          <WingBlank>
            <Button type="primary" onClick={this.handleContinueClick}>Start</Button>
          </WingBlank>
        );
      case POMODORO_STATUS.FOCUS:
        return (
          <WingBlank>
            <Button type="primary" onClick={this.handleContinueClick}>Stop</Button>
          </WingBlank>
        );
      case POMODORO_STATUS.FOCUS_STOP:
        return (
          <WingBlank>
            <Button type="primary" onClick={this.handleContinueClick}>Continue</Button>
            <WhiteSpace />
            <Button type="primary" onClick={this.handleResetClick}>Reset</Button>
          </WingBlank>
        );
      case POMODORO_STATUS.BREAK_READY:
        return (
          <WingBlank>
            <Button type="primary" onClick={this.handleContinueClick}>Start</Button>
          </WingBlank>
        );
      case POMODORO_STATUS.BREAK:
        return (
          <WingBlank>
            <Button type="primary" onClick={this.handleContinueClick}>Stop</Button>
          </WingBlank>
        );
      case POMODORO_STATUS.BREAK_STOP:
        return (
          <WingBlank>
            <Button type="primary" onClick={this.handleContinueClick}>Continue</Button>
            <WhiteSpace />
            <Button type="primary" onClick={this.handleResetClick}>Reset</Button>
          </WingBlank>
        );
      default:
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WhiteSpace />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>{this.state.status}</Text>
        </View>
        <WhiteSpace />
        <Picker
          data={data}
          title="Choose Time"
          cascade={false}
          okText="OK"
          dismissText="Cancel"
          value={this.state.pickerTime}
          onOk={this.onPickerOk}
          disabled={this.state.pickerDisabled}
        >
          <Circle text={`${this.state.countdownTime[0]}:${this.state.countdownTime[1]}`} />
        </Picker>
        <WhiteSpace />
        {this.displayButton()}
      </View>
    );
  }
}
