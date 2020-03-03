import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const emberGuidRegex = /ember\d+/;

const Payload = {
    source: 'dummy',
    tables: [
      {
        name: 'tableName',
        description: 'Table Description',
        longName: 'tableLongName',
        category: 'General',
        timeGrains: [
          {
            name: 'day',
            description: 'The tableName day grain',
            metrics: [
              {
                category: 'category',
                name: 'metricOne',
                longName: 'Metric One',
                uri: 'https://metric-one-url',
                type: 'number'
              },
              {
                category: 'category',
                name: 'metricTwo',
                longName: 'Metric Two',
                uri: 'https://metric-two-url',
                type: 'money',
                parameters: {
                  currency: {
                    type: 'dimension',
                    dimensionName: 'displayCurrency',
                    defaultValue: 'USD'
                  }
                }
              }
            ],
            retention: 'P24M',
            longName: 'Day',
            dimensions: [
              {
                category: 'categoryOne',
                name: 'dimensionOne',
                longName: 'Dimension One',
                uri: 'https://host:port/namespace/dimensions/dimensionOne',
                cardinality: '10',
                datatype: 'text'
              },
              {
                category: 'categoryTwo',
                name: 'dimensionTwo',
                longName: 'Dimension Two',
                uri: 'https://host:port/namespace/dimensions/dimensionTwo',
                cardinality: '5',
                datatype: 'text'
              },
              {
                category: 'dateCategory',
                name: 'dimensionThree',
                longName: 'Dimension Three',
                uri: 'https://host:port/namespace/dimensions/dimensionThree',
                cardinality: '50000',
                datatype: 'date'
              }
            ]
          },
          {
            name: 'month',
            description: 'The tableName month grain',
            metrics: [
              {
                category: 'category',
                name: 'metricOne',
                longName: 'Metric One',
                uri: 'https://metric-one-url',
                type: 'number'
              },
              {
                category: 'category',
                name: 'metricTwo',
                longName: 'Metric Two',
                uri: 'https://metric-two-url',
                type: 'money',
                parameters: {
                  currency: {
                    type: 'dimension',
                    dimensionName: 'displayCurrency',
                    defaultValue: 'USD'
                  }
                }
              }
            ],
            retention: 'P24M',
            longName: 'MONTH',
            dimensions: [
              {
                category: 'categoryOne',
                name: 'dimensionOne',
                longName: 'Dimension One',
                uri: 'https://host:port/namespace/dimensions/dimensionOne',
                cardinality: '10',
                datatype: 'text'
              },
              {
                category: 'categoryTwo',
                name: 'dimensionTwo',
                longName: 'Dimension Two',
                uri: 'https://host:port/namespace/dimensions/dimensionTwo',
                cardinality: '5',
                datatype: 'text'
              },
              {
                category: 'dateCategory',
                name: 'dimensionThree',
                longName: 'Dimension Three',
                uri: 'https://host:port/namespace/dimensions/dimensionThree',
                cardinality: '50000',
                datatype: 'date'
              }
            ]
          }
        ]
      },
      {
        name: 'secondTable',
        longName: 'Second Table',
        description: "Second table's description",
        category: 'Special',
        timeGrains: [
          {
            name: 'day',
            description: 'The secondTable day grain',
            longName: 'Day',
            retention: 'P24M',
            metrics: [
              {
                category: 'category',
                name: 'metricOne',
                longName: 'Metric One',
                uri: 'https://metric-one-url',
                type: 'number'
              },
              {
                category: 'category',
                name: 'metricTwo',
                longName: 'Metric Two',
                uri: 'https://metric-two-url',
                type: 'money',
                parameters: {
                  currency: {
                    type: 'dimension',
                    dimensionName: 'displayCurrency',
                    defaultValue: 'USD'
                  }
                }
              }
            ],
            dimensions: [
              {
                category: 'categoryTwo',
                name: 'dimensionTwo',
                longName: 'Dimension Two',
                uri: 'https://host:port/namespace/dimensions/dimensionTwo',
                cardinality: '5',
                datatype: 'text'
              },
              {
                category: 'dateCategory',
                name: 'dimensionThree',
                longName: 'Dimension Three',
                uri: 'https://host:port/namespace/dimensions/dimensionThree',
                cardinality: '50000',
                datatype: 'date'
              }
            ]
          },
          {
            name: 'week',
            description: 'The secondTable week grain',
            longName: 'Week',
            retention: 'P24M',
            metrics: [
              {
                category: 'category',
                name: 'metricOne',
                longName: 'Metric One',
                uri: 'https://metric-one-url',
                type: 'number'
              },
              {
                category: 'category',
                name: 'metricThree',
                longName: 'Metric Three',
                uri: 'https://metric-three-url',
                type: 'number'
              }
            ],
            dimensions: [
              {
                category: 'categoryTwo',
                name: 'dimensionTwo',
                longName: 'Dimension Two',
                uri: 'https://host:port/namespace/dimensions/dimensionTwo',
                cardinality: '5',
                datatype: 'text'
              },
              {
                category: 'dateCategory',
                name: 'dimensionThree',
                longName: 'Dimension Three',
                uri: 'https://host:port/namespace/dimensions/dimensionThree',
                cardinality: '50000',
                datatype: 'date'
              }
            ]
          }
        ]
      }
    ]
  },
  // list of table objects, with table->timegrains->dimensions+metrics
  Tables = [
    {
      id: 'tableName',
      description: 'Table Description',
      name: 'tableLongName',
      category: 'General',
      source: 'dummy',
      metricIds: ['metricOne', 'metricTwo'],
      dimensionIds: ['dimensionOne', 'dimensionTwo'],
      timeDimensionIds: ['dimensionThree']
    },
    {
      id: 'secondTable',
      description: "Second table's description",
      name: 'Second Table',
      category: 'Special',
      source: 'dummy',
      metricIds: ['metricOne', 'metricTwo', 'metricThree'],
      dimensionIds: ['dimensionTwo'],
      timeDimensionIds: ['dimensionThree']
    }
  ],
  Dimensions = [
    {
      category: 'categoryOne',
      id: 'dimensionOne',
      name: 'Dimension One',
      source: 'dummy',
      tableId: 'tableName',
      valueType: 'text',
      storageStrategy: null,
      timegrains: ['day', 'month']
    },
    {
      category: 'categoryTwo',
      id: 'dimensionTwo',
      name: 'Dimension Two',
      source: 'dummy',
      tableId: 'tableName',
      valueType: 'text',
      storageStrategy: null,
      timegrains: ['day', 'month']
    },
    {
      category: 'categoryTwo',
      id: 'dimensionTwo',
      name: 'Dimension Two',
      source: 'dummy',
      tableId: 'secondTable',
      valueType: 'text',
      storageStrategy: null,
      timegrains: ['day', 'week']
    }
  ],
  TimeDimensions = [
    {
      category: 'dateCategory',
      id: 'dimensionThree',
      name: 'Dimension Three',
      source: 'dummy',
      tableId: 'tableName',
      valueType: 'date',
      storageStrategy: null,
      timegrains: ['day', 'month']
    },
    {
      category: 'dateCategory',
      id: 'dimensionThree',
      name: 'Dimension Three',
      source: 'dummy',
      tableId: 'secondTable',
      valueType: 'date',
      storageStrategy: null,
      timegrains: ['day', 'week']
    }
  ],
  Metrics = [
    {
      category: 'category',
      id: 'metricOne',
      name: 'Metric One',
      valueType: 'number',
      source: 'dummy',
      tableId: 'tableName',
      timegrains: ['day', 'month']
    },
    {
      category: 'category',
      id: 'metricTwo',
      name: 'Metric Two',
      valueType: 'money',
      source: 'dummy',
      tableId: 'tableName',
      timegrains: ['day', 'month']
    },
    {
      category: 'category',
      id: 'metricOne',
      name: 'Metric One',
      valueType: 'number',
      source: 'dummy',
      tableId: 'secondTable',
      timegrains: ['day', 'week']
    },
    {
      category: 'category',
      id: 'metricTwo',
      name: 'Metric Two',
      valueType: 'money',
      source: 'dummy',
      tableId: 'secondTable',
      timegrains: ['day']
    },
    {
      category: 'category',
      id: 'metricThree',
      name: 'Metric Three',
      valueType: 'number',
      source: 'dummy',
      tableId: 'secondTable',
      timegrains: ['week']
    }
  ],
  FunctionArguments = [
    {
      id: 'currency',
      name: 'currency',
      valueType: 'TEXT',
      type: 'ref',
      expression: 'dimension:displayCurrency',
      values: null,
      defaultValue: 'USD'
    },
    {
      id: 'type',
      name: 'type',
      valueType: 'TEXT',
      type: 'ref',
      expression: 'self',
      values: [
        {
          id: 'l',
          description: 'Left'
        },
        {
          id: 'r',
          description: 'Right'
        },
        {
          id: 'm',
          description: 'Middle'
        }
      ],
      defaultValue: 'l'
    }
  ];

let Serializer;

module('Unit | Bard Metadata Serializer', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    Serializer = this.owner.lookup('serializer:bard-metadata');
  });

  test('normalize without metric function ids provided', function(assert) {
    assert.expect(8);

    const { tables, metrics, dimensions, timeDimensions, metricFunctions } = Serializer.normalize(Payload);

    const metricsWithoutFuncIds = metrics.map(met => {
      const metWithoutFuncId = Object.assign({}, met);
      delete metWithoutFuncId.metricFunctionId;
      return metWithoutFuncId;
    });

    assert.deepEqual(metricsWithoutFuncIds, Metrics, 'Correctly parsed metric objects from payload');

    assert.deepEqual(dimensions, Dimensions, 'Correctly parsed dimension objects from payload');

    assert.deepEqual(timeDimensions, TimeDimensions, 'Correctly parsed and normalized time dimension objects');

    assert.deepEqual(tables, Tables, 'Correctly parsed table objects from payload');

    assert.equal(
      metricFunctions.length,
      1,
      'One metric function is created for all metrics with only the currency parameter'
    );
    const currencyMetricFunctionArguments = [
      {
        id: 'currency',
        name: 'currency',
        valueType: 'TEXT',
        type: 'ref',
        expression: 'dimension:displayCurrency',
        values: null,
        defaultValue: 'USD'
      }
    ];

    const { id: metricFunctionId, arguments: args } = metricFunctions[0];
    assert.deepEqual(args, currencyMetricFunctionArguments, 'The derived metric function has the correct arguments');
    assert.ok(emberGuidRegex.test(metricFunctionId), 'Derived metric function has a uuid as the id');

    const expectedMetricsWithFunctionIds = Metrics.map(metric => {
      if (metric.valueType === 'money') {
        metric.metricFunctionId = metricFunctionId;
      }
      return metric;
    });

    assert.deepEqual(
      metrics,
      expectedMetricsWithFunctionIds,
      'The normalized metrics list has the correct metric function ids attached to them'
    );
  });

  test('normalize with metric function ids provided', function(assert) {
    const MetricFunctionIdsPayload = {
      source: 'dummy',
      tables: [
        {
          name: 'tableName',
          description: 'Table Description',
          longName: 'tableLongName',
          category: 'General',
          timeGrains: [
            {
              name: 'day',
              description: 'The tableName day grain',
              metrics: [
                {
                  category: 'category',
                  name: 'metricOne',
                  longName: 'Metric One',
                  uri: 'https://metric-one-url',
                  type: 'number'
                },
                {
                  category: 'category',
                  name: 'metricTwo',
                  longName: 'Metric Two',
                  uri: 'https://metric-two-url',
                  type: 'money',
                  metricFunctionId: 'moneyMetric'
                }
              ],
              retention: 'P24M',
              longName: 'Day',
              dimensions: [
                {
                  category: 'categoryOne',
                  name: 'dimensionOne',
                  longName: 'Dimension One',
                  uri: 'https://host:port/namespace/dimensions/dimensionOne',
                  cardinality: '10',
                  datatype: 'text'
                }
              ]
            },
            {
              name: 'month',
              description: 'The tableName month grain',
              metrics: [
                {
                  category: 'category',
                  name: 'metricOne',
                  longName: 'Metric One',
                  uri: 'https://metric-one-url',
                  type: 'number'
                },
                {
                  category: 'category',
                  name: 'metricTwo',
                  longName: 'Metric Two',
                  uri: 'https://metric-two-url',
                  type: 'money',
                  metricFunctionId: 'moneyMetric'
                }
              ],
              retention: 'P24M',
              longName: 'MONTH',
              dimensions: [
                {
                  category: 'categoryOne',
                  name: 'dimensionOne',
                  longName: 'Dimension One',
                  uri: 'https://host:port/namespace/dimensions/dimensionOne',
                  cardinality: '10',
                  datatype: 'text'
                }
              ]
            }
          ]
        }
      ]
    };

    const { metrics, dimensions, tables, metricFunctions, timeDimensions } = Serializer.normalize(
      MetricFunctionIdsPayload
    );

    assert.deepEqual(
      metrics,
      [
        {
          category: 'category',
          id: 'metricOne',
          name: 'Metric One',
          valueType: 'number',
          source: 'dummy',
          tableId: 'tableName',
          timegrains: ['day', 'month']
        },
        {
          category: 'category',
          id: 'metricTwo',
          name: 'Metric Two',
          valueType: 'money',
          source: 'dummy',
          tableId: 'tableName',
          metricFunctionId: 'moneyMetric',
          timegrains: ['day', 'month']
        }
      ],
      'The metric with parameters has a metricFunctionId provided by the raw data'
    );

    assert.deepEqual(
      tables,
      [
        {
          id: 'tableName',
          description: 'Table Description',
          name: 'tableLongName',
          category: 'General',
          source: 'dummy',
          metricIds: ['metricOne', 'metricTwo'],
          dimensionIds: ['dimensionOne'],
          timeDimensionIds: []
        }
      ],
      'Table has the correct columns associated with it'
    );

    assert.deepEqual(
      dimensions,
      [
        {
          category: 'categoryOne',
          id: 'dimensionOne',
          name: 'Dimension One',
          source: 'dummy',
          tableId: 'tableName',
          valueType: 'text',
          storageStrategy: null,
          timegrains: ['day', 'month']
        }
      ],
      'The lone dimension on the table is returned in the dimensions list'
    );

    assert.deepEqual(timeDimensions, [], 'No time dimensions are present on the table');

    assert.equal(
      metricFunctions,
      null,
      'The metric functions list is set to null when the metric functions are provided in an endpoint'
    );
  });

  test('_constructFunctionArguments', function(assert) {
    const parameters = {
      currency: {
        type: 'dimension',
        defaultValue: 'USD',
        dimensionName: 'displayCurrency'
      },
      type: {
        type: 'enum',
        defaultValue: 'l',
        values: [
          {
            id: 'l',
            description: 'Left'
          },
          {
            id: 'r',
            description: 'Right'
          },
          {
            id: 'm',
            description: 'Middle'
          }
        ]
      }
    };

    assert.deepEqual(
      Serializer._constructFunctionArguments(parameters),
      FunctionArguments,
      'The parameter objects are successfully turned into metric function arguments'
    );
  });

  test('_getMetricFunction', function(assert) {
    assert.expect(9);

    const metricFunctions = new Set();

    const result = Serializer._getMetricFunction(metricFunctions, FunctionArguments);
    assert.deepEqual(
      Object.keys(result),
      ['name', 'description', 'arguments', 'id'],
      'Serialized metric function object is returned in the right shape'
    );
    assert.ok(emberGuidRegex.test(result.id), 'A metric function with a ember-guid as its id is returned');
    assert.deepEqual(result.arguments, FunctionArguments, 'The newly created metric function contains the arguments');

    // Add result to the metric functions set
    metricFunctions.add(result);

    const sameResult = Serializer._getMetricFunction(metricFunctions, FunctionArguments);
    assert.equal(
      //explicitly use assert.equal because we are checking that they are the same reference
      sameResult,
      result,
      'Passing the same arguments as an existing metric function returns the existing metric function'
    );
    assert.deepEqual([...metricFunctions], [result], 'No new metric functions should have been created');

    const distinctResult = Serializer._getMetricFunction(metricFunctions, [FunctionArguments[0]]);
    assert.notEqual(
      // Make sure the new result is a different reference
      distinctResult,
      result,
      'A new metric function is created when there is no existing metric function with the exact same arguments'
    );
    assert.ok(emberGuidRegex.test(distinctResult.id), 'New metric function with a uuid as its id is returned');
    assert.deepEqual(
      Object.keys(distinctResult),
      ['name', 'description', 'arguments', 'id'],
      'Serialized metric function object is returned in the right shape'
    );
    assert.deepEqual(
      distinctResult.arguments,
      [FunctionArguments[0]],
      'The new metric function has the expected arguments'
    );
  });
});
