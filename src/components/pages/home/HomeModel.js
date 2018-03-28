import {createAction, handleActions} from "redux-actions";
import moment from 'moment';
import {config} from '../../../config'

// Page name constant
export const HOME_PAGE_NAME = 'home';

// Actino creators
export const
  sensorsDataReceived = createAction('Home.sensorsDataReceived'),
  sensorLogReceived = createAction('Home.sensorLogReceived');

// Receives Sensor data
export function getSensorsData() {
  return async (dispatch) => {
    let res = await fetch(config.apiUrl + `/sensors`, {
      credentials: 'include'
    });

    if (res.ok) {
      dispatch(sensorsDataReceived(await res.json()));
    }
  }
}

// Receives Sensor Log data and updates store
export function getSensorLog(sensorId) {
  return async (dispatch) => {
    const time = moment().utc().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss');

    let res = await fetch(config.apiUrl + `/sensors/${sensorId}/log?from=${time}`, {
      credentials: 'include'
    });

    if (res.ok) {
      dispatch(sensorLogReceived({
        sensorId,
        data: (await res.json()).map(e => ({
          ...e,
          timestamp: moment(e.timestamp).format('HH:mm:ss')
        }))
      }));
    }
  }
}

// Default page state
const DEFAULT_STATE = {
  sensorsData: [],
  sensorsDataById: {},
  sensorLogsById: {}
};

// Page reducer
export const reduceHome = handleActions({
  [sensorsDataReceived](state, {payload}) {
    let byId = {};

    payload.forEach(sd => byId[sd.id] = sd);

    return {
      ...state,
      sensorsData: payload,
      sensorsDataById: byId
    };
  },
  [sensorLogReceived](state, {payload}) {
    return {
      ...state,
      sensorLogsById: {
        ...state.sensorLogsById,
        [payload.sensorId]: payload.data
      }
    }
  }
}, DEFAULT_STATE);
