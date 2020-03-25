import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { RequestActions } from 'navi-reports/services/request-action-dispatcher';

module('Unit | Consumer | request logical table', function(hooks) {
  setupTest(hooks);

  test('UPDATE_TABLE', function(assert) {
    assert.expect(5);

    const MockDispatcher = {
      dispatch(action, route, timeGrain) {
        assert.equal(action, RequestActions.ADD_TIME_GRAIN, 'ADD_TIME_GRAIN is sent as part of UPDATE_TABLE');

        assert.equal(
          timeGrain,
          'day',
          'When the old and new tables share a time grain, that grain is given to ADD_TIME_GRAIN'
        );
      }
    };

    let logicalTable = { table: 'oldTable', timeGrain: 'day' },
      currentModel = { request: { logicalTable, dataSource: 'oldDataSource' } },
      subject = this.owner
        .factoryFor('consumer:request/logical-table')
        .create({ requestActionDispatcher: MockDispatcher }),
      newTable = { name: 'newTable', timeGrains: ['day', 'week'], source: 'newDataSource' };

    /* == Old + New tables share a time grain == */
    subject.send(RequestActions.UPDATE_TABLE, { currentModel }, newTable);
    assert.equal(logicalTable.table, newTable, 'UPDATE_TABLE updates the table field on a logical table');
    assert.equal(currentModel.request.dataSource, 'newDataSource');

    /* == New table has different time grains == */
    newTable.timeGrains = ['week'];
    MockDispatcher.dispatch = (action, route, timeGrain) => {
      assert.equal(
        timeGrain,
        'week',
        "When new table doesn't have previous time grain, the first grain is given to ADD_TIME_GRAIN"
      );
    };
    subject.send(RequestActions.UPDATE_TABLE, { currentModel }, newTable);
  });
});
