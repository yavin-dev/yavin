/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * Usage:
 *   {{#dimension-selector
 *      request=request
 *      onAddDimension=(action 'addDimension')
 *      onRemoveDimension=(action 'removeDimension')
 *      onAddTimeGrain=(action 'addTimeGrain')
 *      onRemoveTimeGrain=(action 'removeTimeGrain')
 *   }}
 *      {{navi-list-selector}}
 *   {{/dimension-selector}}
 */

import { readOnly, mapBy } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { A as arr } from '@ember/array';
import layout from '../templates/components/dimension-selector';
import { featureFlag } from 'navi-core/helpers/feature-flag';

export default class DimensionSelector extends Component {
  layout = layout;

  /*
   * @property {Array} classNames
   */
  classNames = ['checkbox-selector', 'checkbox-selector--dimension'];

  /*
   * @property {Array} allDimensions
   */
  @computed('request.logicalTable.table.{dimensions,timeDimensions}')
  get allDimensions() {
    const { dimensions, timeDimensions } = this.request.logicalTable.table;
    return [...dimensions, ...timeDimensions];
  }

  /*
   * @property {Array} timeGrains - copy of all time grains for the logical table selected
   */
  @readOnly('request.logicalTable.table.timeGrains')
  timeGrains;

  /*
   * @property {Array} allTimeGrains - all time grains for the logical table selected
   */
  @computed('timeGrains')
  get allTimeGrains() {
    const timeGrains = this.timeGrains;

    return timeGrains
      .filter(grain => grain?.id !== 'all')
      .map(grain => Object.assign({}, grain, { category: 'Time Grain' }));
  }

  /*
   * @property {Array} listItems - all list items to populate the dimension selector,
   *                               combination of timegrains and dimensions
   */
  @computed('allTimeGrains', 'allDimensions')
  get listItems() {
    return [...(this.allTimeGrains || []), ...(this.allDimensions || [])];
  }

  /*
   * @property {Array} selectedDimensions - dimensions in the request
   */
  @mapBy('request.dimensions', 'dimension')
  selectedDimensions;

  /*
   * @property {Array} selectedFilters - filters in the request
   */
  @computed('request.filters.[]')
  get selectedFilters() {
    return get(this, 'request.filters').mapBy('dimension');
  }

  /*
   * @property {Object} selectedTimeGrain - timeGrain in the request
   */
  @computed('request.logicalTable.timeGrain', 'allTimeGrains')
  get selectedTimeGrain() {
    const {
      allTimeGrains,
      request: {
        logicalTable: { timeGrain }
      }
    } = this;

    return allTimeGrains.find(grain => grain.id === timeGrain);
  }

  /*
   * @property {Object} selectedColumnsAndFilters - combination of selectedColumns and SelectedFilters
   */
  @computed('selectedColumns', 'selectedFilters')
  get selectedColumnsAndFilters() {
    return arr([...get(this, 'selectedColumns'), ...get(this, 'selectedFilters')]).uniq();
  }

  /*
   * @property {Object} selectedColumns - unique selectedDimensions
   */
  @computed('selectedTimeGrain', 'selectedDimensions')
  get selectedColumns() {
    if (this.selectedTimeGrain === 'all') {
      return this.selectedDimensions;
    } else {
      return arr([this.selectedTimeGrain, ...this.selectedDimensions]).uniq();
    }
  }

  /*
   * @property {Object} itemsChecked - item -> boolean map to denote if item should be checked
   */
  @computed('selectedColumns')
  get itemsChecked() {
    return get(this, 'selectedColumns').reduce((items, item) => {
      items[get(item, 'id')] = true;
      return items;
    }, {});
  }

  /*
   * @property {Object} dimensionsFiltered - dimension -> boolean mapping denoting presence of dimension
   *                                         in request filters
   */
  @computed('request.filters.[]')
  get dimensionsFiltered() {
    return get(this, 'request.filters')
      .mapBy('dimension.id')
      .reduce((list, dimension) => {
        list[dimension] = true;
        return list;
      }, {});
  }

  actions = {
    /*
     * @action itemClicked
     * @param {Object} item
     */
    itemClicked(item) {
      const type = item.category === 'Time Grain' ? 'TimeGrain' : 'Dimension',
        enableRequestPreview = featureFlag('enableRequestPreview'),
        action = (enableRequestPreview && type === 'Dimension') || !this.itemsChecked[item.id] ? 'Add' : 'Remove';

      const handler = this[`on${action}${type}`];

      if (handler) handler(item);
    }
  };
}
