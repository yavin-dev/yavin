import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Pretender from 'pretender';
import metadataRoutes, {
  TableOne,
  TableTwo,
  Tables,
  DimensionOne,
  DimensionTwo,
  DimensionThree,
  MetricOne,
  MetricTwo,
  Host
} from '../../helpers/metadata-routes';

let Service, Server, originalService;

module('Unit - Service - Bard Metadata', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    originalService = this.owner.factoryFor('service:bard-metadata');
    const newService = this.owner.factoryFor('service:bard-metadata').class.extend({
      host: Host
    });
    this.owner.unregister('service:bard-metadata');
    this.owner.register('service:bard-metadata', newService);

    Service = this.owner.lookup('service:bard-metadata');

    //setup Pretender
    Server = new Pretender(metadataRoutes);
  });

  hooks.afterEach(function() {
    this.owner.unregister('service:bard-metadata');
    this.owner.register('service:bard-metadata', originalService);

    //shutdown pretender
    Server.shutdown();
  });

  test('Service Exists', function(assert) {
    assert.ok(!!Service, 'Service exists');
  });

  test('loadMetadata', async function(assert) {
    assert.expect(4);

    await Service.loadMetadata();
    let keg = Service._keg;

    assert.deepEqual(
      keg.all('metadata/table').mapBy('id'),
      Tables.map(table => table.name),
      'All tables are loaded in the keg'
    );

    assert.deepEqual(
      keg.all('metadata/dimension').mapBy('id'),
      [
        `table1.${DimensionOne.name}`,
        `table1.${DimensionThree.name}`,
        `table2.${DimensionTwo.name}`,
        `smallTable.${DimensionOne.name}`
      ],
      'All dimensions are loaded in the keg'
    );

    assert.deepEqual(
      keg.all('metadata/metric').mapBy('id'),
      [`table1.${MetricOne.name}`, `table2.${MetricTwo.name}`, `smallTable.${MetricOne.name}`],
      'All metrics are loaded in the keg'
    );

    assert.deepEqual(Service.loadedDataSources, ['dummy'], 'One datasource should be loaded');
  });

  test('loadMetadata from multiple sources', async function(assert) {
    assert.expect(12);
    metadataRoutes.bind(Server)(1);
    await Service.loadMetadata({ dataSourceName: 'dummy' });
    await Service.loadMetadata({ dataSourceName: 'blockhead' });

    assert.equal(
      Service.getById('table', 'table1', 'dummy').source,
      'dummy',
      'Table 1 is loaded with the correct data source'
    );
    assert.equal(Service.getById('table', 'table2').source, 'dummy', 'Table 2 is loaded with the correct data source');
    assert.equal(
      Service.getById('table', 'table3', 'blockhead').source,
      'blockhead',
      'Table 3 is loaded with the correct data source'
    );
    assert.equal(
      Service.getById('table', 'table4', 'blockhead').source,
      'blockhead',
      'Table 4 is loaded with the correct data source'
    );

    assert.equal(
      Service.getById('metric', 'table1.metricOne', 'dummy').source,
      'dummy',
      'MetricOne is loaded with the correct data source'
    );
    assert.equal(
      Service.getById('metric', 'table2.metricTwo').source,
      'dummy',
      'MetricTwo is loaded with the correct data source'
    );
    assert.equal(
      Service.getById('metric', 'table3.metricThree', 'blockhead').source,
      'blockhead',
      'MetricThree is loaded with the correct data source'
    );
    assert.equal(
      Service.getById('metric', 'table4.metricFour', 'blockhead').source,
      'blockhead',
      'MetricFour is loaded with the correct data source'
    );

    assert.equal(
      Service.getById('dimension', 'table1.dimensionOne', 'dummy').source,
      'dummy',
      'DimensionOne is loaded with the correct data source'
    );
    assert.equal(
      Service.getById('dimension', 'table2.dimensionTwo').source,
      'dummy',
      'DimensionTwo is loaded with the correct data source'
    );
    assert.equal(
      Service.getById('dimension', 'table1.dimensionThree').source,
      'dummy',
      'DimensionThree is loaded with the correct data source'
    );
    assert.equal(
      Service.getById('dimension', 'table3.dimensionFour', 'blockhead').source,
      'blockhead',
      'DimensionFour is loaded with the correct data source'
    );
  });

  test('loadMetadata after data loaded', async function(assert) {
    assert.expect(1);

    const result = await Service.loadMetadata();
    assert.notOk(result, 'loadMetadata returns a promise that resolves to nothing when metadata is already loaded');
  });

  test('_loadMetadataForType', async function(assert) {
    assert.expect(1);

    this.owner.register('model:metadata/record', EmberObject.extend());

    let keg = this.owner.lookup('service:keg'),
      testRecord = { id: 'foo', description: 'foo' };

    await Service._loadMetadataForType('record', [testRecord]);

    let record = keg.getById('metadata/record', 'foo');

    assert.deepEqual(
      { id: record.id, description: record.description },
      testRecord,
      'The testRecord has been pushed to the keg'
    );
  });

  test('all method', async function(assert) {
    assert.expect(5);

    await Service.loadMetadata();
    assert.deepEqual(
      Service.all('table').mapBy('id'),
      [TableOne.name, TableTwo.name, 'smallTable'],
      'all method returns all loaded tables'
    );

    assert.deepEqual(
      Service.all('dimension').mapBy('id'),
      ['table1.dimensionOne', 'table1.dimensionThree', 'table2.dimensionTwo', 'smallTable.dimensionOne'],
      'all method returns all loaded dimensions'
    );

    assert.deepEqual(
      Service.all('metric').mapBy('id'),
      ['table1.metricOne', 'table2.metricTwo', 'smallTable.metricOne'],
      'all method returns all loaded metrics'
    );

    assert.throws(
      () => {
        Service.all('foo');
      },
      new Error('Assertion Failed: Type must be a valid navi-data model type'),
      'Service `all` method throws error when metadata type is invalid'
    );

    Service.set('loadedDataSources', []);

    assert.throws(
      () => {
        Service.all('metric');
      },
      new Error('Assertion Failed: Metadata must be loaded before the operation can be performed'),
      'Service `all` method throws error when metadata is not loaded'
    );
  });

  test('getById', async function(assert) {
    assert.expect(6);

    await Service.loadMetadata();
    let keg = getOwner(Service).lookup('service:keg');

    assert.equal(
      Service.getById('table', 'table1'),
      keg.getById('metadata/table', 'table1', 'dummy'),
      'Table1 is fetched from the keg using getMetadtaById'
    );

    assert.equal(
      Service.getById('dimension', 'dimensionOne'),
      keg.getById('metadata/dimension', 'dimensionOne', 'dummy'),
      'DimensionOne is fetched from the keg using getMetadtaById'
    );

    assert.equal(
      Service.getById('metric', 'metricOne'),
      keg.getById('metadata/metric', 'metricOne', 'dummy'),
      'MetricOne is fetched from the keg using getMetadtaById'
    );

    assert.equal(Service.getById('metric'), undefined, 'getById returns undefined when no id is passed');

    assert.throws(
      () => {
        Service.getById('foo');
      },
      new Error('Assertion Failed: Type must be a valid navi-data model type'),
      'Service `getById` method throws error when metadata type is invalid'
    );

    Service.set('loadedDataSources', []);

    assert.throws(
      () => {
        Service.getById('metric');
      },
      new Error('Assertion Failed: Metadata must be loaded before the operation can be performed'),
      'Service `getById` method throws error when metadata is not loaded'
    );
  });

  test('fetchById', async function(assert) {
    assert.expect(5);
    Service.set('loadedDataSources', ['dummy']);
    metadataRoutes.bind(Server)(1);

    const expectedMetric = {
      id: MetricOne.name,
      name: MetricOne.longName,
      description: MetricOne.description
    };
    const data = await Service.fetchById('metric', 'metricOne');
    assert.ok(
      Object.keys(expectedMetric).every(key => expectedMetric[key] === data[key]),
      'Service fetchById should load correct data'
    );

    let keg = Service._keg;

    assert.deepEqual(keg.all('metadata/metric').mapBy('id'), ['metricOne'], 'Fetched entity has been added to the keg');

    await Service.fetchById('metric', 'metricOne');
    assert.equal(Server.handledRequests.length, 2, 'Fetched entity from service every call');

    assert.deepEqual(
      keg.all('metadata/metric').mapBy('id'),
      ['metricOne'],
      'Fetching an entity already present in the keg doesn`t add another copy into the keg'
    );

    await Service.fetchById('metric', 'metricThree', 'blockhead');
    assert.deepEqual(keg.all('metadata/metric').mapBy('id'), ['metricOne', 'metricThree']);

    Service.set('loadedDataSources', []);
  });

  test('multi-source all', async function(assert) {
    metadataRoutes.bind(Server)(1);
    await Service.loadMetadata({ dataSourceName: 'dummy' });
    await Service.loadMetadata({ dataSourceName: 'blockhead' });

    assert.deepEqual(
      Service.all('metric').mapBy('id'),
      [
        'table1.metricOne',
        'table2.metricTwo',
        'smallTable.metricOne',
        'table3.metricThree',
        'table4.metricFour',
        'table5.metricFour'
      ],
      'All query pulls in all metrics'
    );

    assert.deepEqual(
      Service.all('metric', 'dummy').mapBy('id'),
      ['table1.metricOne', 'table2.metricTwo', 'smallTable.metricOne'],
      'All query pulls in metrics for dummy datasource'
    );

    assert.deepEqual(
      Service.all('metric', 'blockhead').mapBy('id'),
      ['table3.metricThree', 'table4.metricFour', 'table5.metricFour'],
      'All query pulls in metrics for blockhead datasource'
    );
  });

  test('findById', async function(assert) {
    assert.expect(12);
    metadataRoutes.bind(Server)(1);
    Service.set('loadedDataSources', ['dummy']);
    const metricOne = await Service.findById('metric', 'metricOne', 'dummy');
    const expectedMetric = {
      id: MetricOne.name,
      name: MetricOne.longName,
      description: MetricOne.description
    };
    assert.ok(
      Object.keys(expectedMetric).every(key => expectedMetric[key] === metricOne[key]),
      'Service findById should load correct data'
    );

    let keg = Service._keg;

    assert.deepEqual(keg.all('metadata/metric').mapBy('id'), ['metricOne'], 'Fetched entity has been added to the keg');

    const data = await Service.findById('metric', 'metricOne');
    assert.ok(
      Object.keys(expectedMetric).every(key => expectedMetric[key] === data[key]),
      'Service findById should return correct data'
    );
    assert.equal(Server.handledRequests.length, 1, 'Meta data endpoint only called once');

    let blockheadData = await Service.findById('metric', 'metricThree', 'blockhead');

    assert.equal(
      blockheadData.id,
      'metricThree',
      'Service findById should return correct data when requesting other datasource'
    );
    assert.equal(Server.handledRequests.length, 2, 'Meta data endpoint called once for each metric');

    keg.push(
      'metadata/metric',
      { id: MetricTwo.name, name: MetricTwo.longName, category: MetricTwo.category, partialData: true },
      { namespace: 'dummy' }
    );

    const kegRecord = keg.getById('metadata/metric', 'metricTwo', 'dummy');
    assert.ok(kegRecord?.partialData, 'Partial metric exists in keg with partial data flag');

    const partialLoadExpectedMetric = {
      id: MetricTwo.name,
      name: MetricTwo.longName,
      category: MetricTwo.category
    };

    const findOnPartiallyLoadedMetric = await Service.findById('metric', 'metricTwo', 'dummy');
    assert.ok(
      Object.keys(partialLoadExpectedMetric).every(
        key => partialLoadExpectedMetric[key] === findOnPartiallyLoadedMetric[key]
      ),
      'Correct metric is returned'
    );
    assert.notOk(
      findOnPartiallyLoadedMetric?.partialData,
      'Partial data flag is no longer present after direct access of metric'
    );
    assert.equal(Server.handledRequests.length, 3, 'Another request is sent for a partially loaded model');

    const findAgain = await Service.findById('metric', 'metricTwo', 'dummy');
    assert.equal(findAgain, findOnPartiallyLoadedMetric, 'Same record is returned on a second call');
    assert.equal(Server.handledRequests.length, 3, 'No more requests are sent for subsequent findById calls');

    Service.set('loadedDataSources', []);
  });

  test('getMetaField', async function(assert) {
    assert.expect(3);
    await Service.loadMetadata();
    assert.equal(Service.getMetaField('metric', 'table1.metricOne', 'name'), 'Metric One', 'gets field from requested');

    assert.equal(
      Service.getMetaField('metric', 'table1.metricOne', 'shortName', 'someDefault'),
      'someDefault',
      'returns default when field is not found'
    );

    assert.equal(
      Service.getMetaField('metric', 'InvalidMetric', 'shortName', 'someDefault'),
      'someDefault',
      'returns default when metric is not found'
    );
  });

  test('multi datasource getMetaField', async function(assert) {
    assert.expect(5);
    metadataRoutes.bind(Server)(1);
    await Service.loadMetadata({ dataSourceName: 'dummy' });
    await Service.loadMetadata({ dataSourceName: 'blockhead' });
    assert.equal(
      Service.getMetaField('metric', 'table1.metricOne', 'name', null, 'dummy'),
      'Metric One',
      'gets field from requested dummy datasource'
    );
    assert.equal(
      Service.getMetaField('metric', 'table3.metricThree', 'name', null, 'blockhead'),
      'Metric Three',
      'gets field from requested blockhead data source'
    );

    assert.equal(
      Service.getMetaField('metric', 'table1.metricOne', 'shortName', 'someDefault', 'dummy'),
      'someDefault',
      'returns default when field is not found'
    );

    assert.equal(
      Service.getMetaField('metric', 'InvalidMetric', 'shortName', 'someDefault', 'dummy'),
      'someDefault',
      'returns default when metric is not found'
    );

    assert.equal(
      Service.getMetaField('metric', 'table1.metricOne', 'name', 'someDefault', 'blockhead'),
      'someDefault',
      'Returns default when metric can not be found in given namespace'
    );
  });
});
