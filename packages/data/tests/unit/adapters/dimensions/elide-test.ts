import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import ElideDimensionAdapter from 'navi-data/adapters/dimensions/elide';
import { DimensionColumn } from 'navi-data/adapters/dimensions/interface';
import { RequestV2, AsyncQueryResponse, QueryStatus, RequestOptions } from 'navi-data/adapters/facts/interface';
import DimensionMetadataModel from 'navi-data/models/metadata/dimension';

const fakeResponse: AsyncQueryResponse = {
  asyncQuery: { edges: [{ node: { id: '1', query: 'foo', status: QueryStatus.COMPLETE, result: null } }] }
};

module('Unit | Adapter | Dimensions | Elide', function(hooks) {
  setupTest(hooks);

  test('find', async function(assert) {
    assert.expect(2);

    const adapter: ElideDimensionAdapter = this.owner.lookup('adapter:dimensions/elide');
    const originalFactAdapter = adapter['factAdapter'];
    const TestDimensionColumn: DimensionColumn = {
      columnMetadata: DimensionMetadataModel.create({
        id: 'dimension1',
        source: 'elideTwo',
        tableId: 'table1'
      }),
      parameters: {
        foo: 'bar'
      }
    };

    const expectedRequest: RequestV2 = {
      columns: [{ field: 'dimension1', parameters: { foo: 'bar' }, type: 'dimension' }],
      filters: [
        { field: 'dimension1', parameters: { foo: 'bar' }, type: 'dimension', operator: 'in', values: ['v1', 'v2'] }
      ],
      sorts: [],
      table: 'table1',
      limit: null,
      dataSource: 'elideTwo',
      requestVersion: '2.0'
    };
    const expectedOptions = {
      timeout: 30000,
      page: 6,
      perPage: 24
    };

    //@ts-ignore
    adapter['factAdapter'] = {
      fetchDataForRequest(request: RequestV2, options?: RequestOptions) {
        assert.deepEqual(request, expectedRequest, 'Correct request is sent to elide fact adapter for find');

        assert.deepEqual(options, expectedOptions, 'Options are passed through to the fact adapter');
        return Promise.resolve(fakeResponse);
      }
    };

    await adapter.find(TestDimensionColumn, [{ operator: 'in', values: ['v1', 'v2'] }], expectedOptions);

    adapter['factAdapter'] = originalFactAdapter;
  });

  test('all', async function(assert) {
    assert.expect(2);

    const adapter: ElideDimensionAdapter = this.owner.lookup('adapter:dimensions/elide');
    const originalFactAdapter = adapter['factAdapter'];
    const TestDimensionColumn: DimensionColumn = {
      columnMetadata: DimensionMetadataModel.create({
        id: 'dimension1',
        source: 'elideOne',
        tableId: 'table1'
      }),
      parameters: {
        foo: 'baz'
      }
    };

    const expectedRequest: RequestV2 = {
      columns: [{ field: 'dimension1', parameters: { foo: 'baz' }, type: 'dimension' }],
      filters: [],
      sorts: [],
      table: 'table1',
      limit: null,
      dataSource: 'elideOne',
      requestVersion: '2.0'
    };
    const expectedOptions = {
      timeout: 30000
    };

    //@ts-ignore
    adapter['factAdapter'] = {
      fetchDataForRequest(request: RequestV2, options?: RequestOptions) {
        assert.deepEqual(
          request,
          expectedRequest,
          'Correct request is sent to elide fact adapter for all dimension values'
        );

        assert.deepEqual(options, expectedOptions, 'Options are passed through to the fact adapter');
        return Promise.resolve(fakeResponse);
      }
    };

    await adapter.all(TestDimensionColumn, expectedOptions);

    adapter['factAdapter'] = originalFactAdapter;
  });

  test('search', async function(assert) {
    assert.expect(2);

    const adapter: ElideDimensionAdapter = this.owner.lookup('adapter:dimensions/elide');
    const originalFactAdapter = adapter['factAdapter'];
    const TestDimensionColumn: DimensionColumn = {
      columnMetadata: DimensionMetadataModel.create({
        id: 'dimension2',
        source: 'elideTwo',
        tableId: 'table3'
      }),
      parameters: {
        bang: 'boom'
      }
    };
    const query = 'something';

    const expectedRequest: RequestV2 = {
      columns: [{ field: 'dimension2', parameters: { bang: 'boom' }, type: 'dimension' }],
      filters: [
        {
          field: 'dimension2',
          parameters: { bang: 'boom' },
          type: 'dimension',
          operator: 'eq',
          values: ['*something*']
        }
      ],
      sorts: [],
      table: 'table3',
      limit: null,
      dataSource: 'elideTwo',
      requestVersion: '2.0'
    };
    const expectedOptions = {
      timeout: 30000,
      perPage: 48
    };

    //@ts-ignore
    adapter['factAdapter'] = {
      fetchDataForRequest(request: RequestV2, options?: RequestOptions) {
        assert.deepEqual(
          request,
          expectedRequest,
          'Correct request is sent to elide fact adapter for search of dimension values'
        );

        assert.deepEqual(options, expectedOptions, 'Options are passed through to the fact adapter');
        return Promise.resolve(fakeResponse);
      }
    };

    await adapter.search(TestDimensionColumn, query, expectedOptions);

    adapter['factAdapter'] = originalFactAdapter;
  });
});
