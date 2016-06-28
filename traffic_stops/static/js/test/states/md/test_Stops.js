import { assert } from 'chai'
import * as S from '../../../app/states/md/Stops.js'
import { __RewireAPI__ as SS } from '../../../app/states/md/Stops.js'
import Backbone from 'backbone'
import $ from 'jquery'
import DATA from './mock_data.js'

describe('states', () => {
  describe('md', () => {
    describe('StopsHandler', () => {
      let Stubbed = S.StopsHandler.extend({
        constructor: Backbone.Model.prototype.constructor,
        get_data: () => null,
        clean_data: () => null
      })

      describe('helpers', () => {
        describe('build_totals', () => {
          it('adds up each item in "data"', () => {
            let input = [
              {
                'foo': 1,
                'bar': 2
              },
              {
                'foo': 1,
                'bar': 2
              }
            ]
            let acceptOut = {
              'foo': 2,
              'bar': 4,
            }
            let out = S.build_totals(input)
            assert.equal('Total', out.year)
            assert.equal(acceptOut.foo, out.foo)
            assert.equal(acceptOut.bar, out.bar)
          })
        })

        describe('build_pie_data', () => {
          it('sets the pie map total to "total"', () => {
            let totalAccept = 'totalAccept'
            let pie = S.build_pie_data([], {totalAccept}, {})
            assert.equal(totalAccept, pie.get('Total').get('totalAccept'))
          })

          it('iterates over data and sets year values on pie', () => {
            let data = [
              {
                'year': 2012,
                'accept': true
              },
              {
                'year': 2013,
                'accept': true
              }
            ]
            let Stops = {
              'start_year': 2012
            }
            let pie = S.build_pie_data(data, {}, Stops)
            assert.isTrue(pie.get(2012).get('accept'))
            assert.isTrue(pie.get(2013).get('accept'))
          })
        })
      })

      describe('clean_data', () => {
        let StopsHandler_ = Stubbed.extend({
          clean_data: S.StopsHandler.prototype.clean_data
        })

        beforeEach(() => {
          SS.__Rewire__('build_totals', () => null)
          SS.__Rewire__('build_pie_data', () => null)
          SS.__Rewire__('build_line_data', () => null)
        })

        afterEach(() => {
          SS.__ResetDependency__('build_totals')
          SS.__ResetDependency__('build_line_data')
          SS.__ResetDependency__('build_pie_data')
        })

        it('sets its data "pie" attribute to the output of build_pie_data', () => {
          let pieAccept = 'pieAccept'
          SS.__Rewire__('build_pie_data', () => pieAccept)

          let sh = new StopsHandler_({ raw_data: DATA })

          sh.clean_data()

          assert.equal(pieAccept, sh.get('data').pie)
        })

        it('sets its data "line" attribute to the output of build_line_data', () => {
          let lineAccept = 'lineAccept'
          SS.__Rewire__('build_line_data', () => lineAccept)

          let sh = new StopsHandler_({ raw_data: DATA })

          sh.clean_data()

          assert.equal(lineAccept, sh.get('data').line)
        })

        it('sets its data "raw" attribute to its "raw_data" value', () => {
          let raw_data = 'accept'
          let sh = new StopsHandler_({ raw_data })

          sh.clean_data()

          assert.equal(raw_data, sh.get('data').raw)
        })
      })
    })
    describe('StopRatioDonut', () => {})
    describe('StopRatioTimeSeries', () => {})
    describe('StopsTable', () => {})
  })
})
