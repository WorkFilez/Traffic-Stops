import Stops from './defaults.js';
import * as C from '../../common/ContrabandHitRate.js';

const ContrabandHitRateHandler = C.ContrabandHitRateHandlerBase.extend({
  Stops: Stops
});

// dashboard visuals

const ContrabandHitRateBar = C.ContrabandHitRateBarBase.extend({
  defaults: {
    width: 750,
    height: 375
  },

  Stops: Stops,

  _items: function () {
    return Stops.ethnicities;
  },

  _pprint: function (type) {
    return Stops.pprint.get(type);
  },

});

const ContrabandTable = C.ContrabandTableBase.extend({
  _get_header_rows: function () {
    return Stops.pprint.values();
  },

  types: [Stops.ethnicities]
});

export default {
  ContrabandHitRateHandler,
  ContrabandHitRateBar,
  ContrabandTable
};
