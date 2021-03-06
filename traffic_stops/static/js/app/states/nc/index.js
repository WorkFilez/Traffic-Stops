import StopByReasonAndRace from './StopByReasonAndRace.js';
import Stops from './defaults.js';
import StopsGraphs from './Stops.js';
import Search from './Search.js';
import SearchByType from './SearchByType.js';
import Census from './Census.js';
import StopSearch from './StopSearch.js';
import LikelihoodOfSearch from './LikelihoodOfSearch.js';
import UseOfForce from './UseOfForce.js';
import ContrabandHitRate from './ContrabandHitRate.js';

if (typeof window.NC === 'undefined') {
  window.NC = {};
}

Object.assign(
  window.NC,

  StopByReasonAndRace,
  {Stops},
  StopsGraphs,
  Search,
  SearchByType,
  Census,
  StopSearch,
  LikelihoodOfSearch,
  UseOfForce,
  ContrabandHitRate
);
