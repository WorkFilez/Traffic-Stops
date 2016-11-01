import { assert } from 'chai'
import TableBase from '../../app/base/TableBase.js'
import { __RewireAPI__ as TB } from '../../app/base/TableBase.js'
import Backbone from 'backbone'
import $ from 'jquery'

describe('base', () => {
  describe('TableBase', () => {
    let handler = new Backbone.Model()

    describe('constructor', () => {
      it('binds this.update to its handler\'s get_data Promise resolution', (done) => {
        let accept = true
        let handler = {
          get_data: () => new Promise((resolve, reject) => resolve(accept))
        }
        let TableBase_ = TableBase.extend({
          update: (data) => {
            assert.equal(data, accept)
            done()
          },

          showError: () => true
        })

        new TableBase_({handler})
      })

      it('binds this.showError to its handler\'s get_data Promise rejection', (done) => {
        let accept = true
        let handler = {
          get_data: () => new Promise((resolve, reject) => reject(accept))
        }
        let TableBase_ = TableBase.extend({
          showError: (error) => {
            assert.equal(error, accept)
            done()
          },

          update: () => true
        })

        new TableBase_({handler})
      })
    })

    describe('update', () => {
      it('calls draw_table', (done) => {
        let TableBase_ = TableBase.extend({
          constructor: function () {
            Backbone.Model.apply(this, arguments);
          },

          draw_table: () => done()
        })

        let tb = new TableBase_()

        tb.update('notUndefined')
      })

      it('sets this.data to its argument', () => {
        let acceptData = 'foo'

        let TableBase_ = TableBase.extend({
          constructor: function () {
            Backbone.Model.apply(this, arguments);
          },

          draw_table: () => null
        })

        let tb = new TableBase_()

        tb.update(acceptData)

        assert.equal(tb.data, acceptData)
      })
    })

    describe('get_tabular_data', () => {
      it('throws', () => {
        let TableBase_ = TableBase.extend({
          constructor: function () {
            Backbone.Model.apply(this, arguments);
          }
        })

        let tb = new TableBase_()

        assert.throws(() => {
          tb.get_tabular_data()
        })
      })
    })

    describe('showError', () => {
      let id = 'test_selector'
      let selector = '#' + id

      before(() => {
        $(`<div id="${ id }"></div>`).appendTo($('body'))
      })

      after(() => {
        document.body.innerHTML = ''
      })

      it('prepends an error message to its selector\'s el', () => {

        let TableBase_ = TableBase.extend({
          constructor: function () {
            Backbone.Model.apply(this, arguments);
          }
        })

        let tb = new TableBase_({ selector })

        tb.showError()

        assert.isOk($('.bg-warning').length)
      })
    })

    describe('draw_table', () => {
      let id = 'test_selector'
      let selector = '#' + id

      before(() => {
        $(`<div id="${ id }"></div>`).appendTo($('body'))
      })

      after(() => {
        document.body.innerHTML = ''
      })

      it('attaches a table using its matrix', () => {
        let TableBase_ = TableBase.extend({
          constructor: function () {
            Backbone.Model.apply(this, arguments);
          },
          get_tabular_data: () => [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
          ]
        })

        let tb = new TableBase_({ selector })

        tb.draw_table()

        assert.isOk($('table.table.table-striped.table-condensed.dash-tables').length)
        assert.equal(3, $('th').length)
        assert.equal(6, $('td').length)
      })
    })
  })
})
