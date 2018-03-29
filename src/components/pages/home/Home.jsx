import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faThermometerThreeQuarters, faMicrochip, faTint, faCaretUp, faCaretDown} from '@fortawesome/fontawesome-free-solid';
import {Line, LineChart, Tooltip, XAxis} from "recharts";
import classNames from 'classnames';
import {getSensorLog, getSensorsData, HOME_PAGE_NAME} from "./HomeModel";
import Header from "../../controls/header/Header";
import Lang from "../../controls/lang/Lang";

// TODO: move this to config/database
const DASHBOARD_SENSOR_IDS = [
  1, 3, 2
];

// TODO: move this to config/database
const DELTA_BY_SENSOR_TYPE = {
  'temp': 0.35,
  'co2': 50,
  'humidity': 2
};

// Data request intervals
const
  SENSORS_REQUEST_INTERVAL = 5000,
  LOGS_REQUEST_INTERVAL = 60000;


// Home page component
class Home extends React.Component {

  // interval Ids
  dataIntervalId = null;
  logsIntervalId = null;

  // Updates sensors data
  updateData() {
    let {getSensorsData} = this.props;

    getSensorsData();
  }

  // Updates Sensor logs data
  updateLogs() {
    let {getSensorLog} = this.props;

    DASHBOARD_SENSOR_IDS.forEach(id => getSensorLog(id));
  }

  // On Component mount
  componentDidMount() {
    this.dataIntervalId = setInterval(() => this.updateData(), SENSORS_REQUEST_INTERVAL);
    this.logsIntervalId = setInterval(() => this.updateLogs(), LOGS_REQUEST_INTERVAL);

    this.updateData();
    this.updateLogs();
  }

  // On Component unmount
  componentWillUnmount() {
    clearInterval(this.dataIntervalId);
    clearInterval(this.logsIntervalId);
  }

  // Renders Icon depending on sensor type
  static renderSensorIcon(type) {
    if (type === 'temp') {
      return <FontAwesomeIcon icon={faThermometerThreeQuarters}/>
    } else if (type === 'humidity') {
      return <FontAwesomeIcon icon={faTint}/>
    } else {
      return <FontAwesomeIcon icon={faMicrochip}/>
    }
  }

  // Renders Color gradient information for chart
  static renderChartDefs() {
    return (
      <defs>
        <linearGradient id="humidity" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9ed2fa"/>
          <stop offset="100%" stopColor="#0941c2"/>
        </linearGradient>

        <linearGradient id="co2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a2e543"/>
          <stop offset="100%" stopColor="#21ba56"/>
        </linearGradient>

        <linearGradient id="temp" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff7a32"/>
          <stop offset="100%" stopColor="#cf3f3d"/>
        </linearGradient>
      </defs>
    );
  }

  // Renders Sensor block
  renderSensor(sensor) {
    if (!sensor) {
      return null;
    }

    const
      {sensorsDataById, sensorLogsById} = this.props,
      sensorDelta = DELTA_BY_SENSOR_TYPE[sensor.type],
      showUp = sensor.longTrendChange > sensorDelta,
      showDown = sensor.longTrendChange < 0 && Math.abs(sensor.longTrendChange) > sensorDelta,
      online = sensor.isOnline;

    return (
      <div className={classNames('sensor', {offline: !online})} key={sensor.id}>
        <div className="sensor__header">
          <div className="sensor__icon">{Home.renderSensorIcon(sensor.type)}</div>
          <div className="sensor__name">{sensor.name}</div>
        </div>

        <div className="sensor__value">
          {
            online &&
            [
              <div className="sensor__value__change" key={1}>
                {showUp && <FontAwesomeIcon icon={faCaretUp}/>}
                {showDown && <FontAwesomeIcon icon={faCaretDown}/>}
              </div>,
              <div className="sensor__value__number" key={2}>{sensor.value}</div>,
              <div className="sensor__value__unit" key={3}>{sensor.unit}</div>
            ]
          }

          {!online && <Lang id="Offline"/>}
        </div>

        <div className="sensor__graph">
          {
            online &&
            <LineChart width={150} height={50} data={sensorLogsById[sensor.id]}>
              {Home.renderChartDefs()}

              <XAxis dataKey="timestamp" hide={true}/>
              <Line type="monotone" dataKey="value" stroke={`url(#${sensor.type})`} dot={null} strokeWidth={2}/>
              <Tooltip formatter={value => value.toString() + sensorsDataById[sensor.id].unit}/>
            </LineChart>
          }
          </div>
      </div>
    );
  }

  // Renders Home page
  render() {
    const {sensorsDataById} = this.props;

    return ([
      <Header title="Home" key="header">
      </Header>,

      <main className="home-page page" key="page">
        <div className="sensors">
          {DASHBOARD_SENSOR_IDS.map(id => this.renderSensor(sensorsDataById[id]))}
        </div>
      </main>
    ]);
  }
}

export default connect(state => ({
  user: state.user,
  sensorsData: state.pages[HOME_PAGE_NAME].sensorsData,
  sensorsDataById: state.pages[HOME_PAGE_NAME].sensorsDataById,
  sensorLogsById: state.pages[HOME_PAGE_NAME].sensorLogsById
}), {getSensorsData, getSensorLog})(injectIntl(Home));
