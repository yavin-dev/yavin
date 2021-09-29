const defaultFields = [
  { name: 'id', description: 'Dimension ID' },
  { name: 'desc', description: 'Dimension Description' },
];

export default {
  defaultDims: [
    {
      name: 'os',
      longName: 'Operating System',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'userDeviceType',
      longName: 'User Device Type',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'age',
      longName: 'Age',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'currency',
      longName: 'Currency',
      cardinality: 500,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'displayCurrency',
      longName: 'Display Currency',
      cardinality: 54,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'gender',
      longName: 'Gender',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'propertyCountry',
      longName: 'Property Country',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'loginState',
      longName: 'Logged-in State',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'platform',
      longName: 'Platform',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'userDeviceTypeV3',
      longName: 'User Device Type V3',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'productFamily',
      longName: 'Product Family',
      cardinality: 100,
      category: 'Asset',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'property',
      longName: 'Property',
      cardinality: 5000,
      category: 'Asset',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'browser',
      longName: 'Browser',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'browserVersion',
      longName: 'Browser Version',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'productRegion',
      longName: 'Product Region',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'platformVersion',
      longName: 'Platform Version',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'screenType',
      longName: 'Screen Type',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'lang',
      longName: 'Language',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'userCountry',
      longName: 'User Country',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'userRegion',
      longName: 'User Region',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'userSubRegion',
      longName: 'User Sub Region',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'productSubRegion',
      longName: 'Product Sub Region',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'outflowChannel',
      longName: 'Outflow Channel',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'outflowSite',
      longName: 'Outflow Site',
      cardinality: 100,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'contextId',
      longName: 'Context Id',
      cardinality: 0,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'none',
      fields: [...defaultFields, { name: 'skip', description: 'skipped field' }],
    },
    {
      name: 'multiSystemId',
      longName: 'Multi System Id',
      cardinality: 9999999,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: [
        { name: 'id', tags: ['id'] },
        { name: 'desc', tags: ['description', 'show'] },
        { name: 'other', tags: ['show'] },
        { name: 'key', tags: ['primaryKey'] },
      ],
    },
    {
      name: 'userSignupDate',
      longName: 'User Signup Date',
      cardinality: 39896,
      category: 'test',
      datatype: 'date',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'commaDim',
      longName: 'Dimension with comma',
      cardinality: 2,
      category: 'test',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: [defaultFields[0]],
    },
    {
      name: 'Budget',
      longName: 'Budget',
      cardinality: 462664,
      category: 'test',
      datatype: 'number',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
  ],

  highCardinalityDims: [
    {
      name: 'eventId',
      longName: 'EventId',
      cardinality: 9999999,
      category: 'Asset',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'parentEventId',
      longName: 'Parent Event Id',
      cardinality: 9999999,
      category: 'Asset',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
  ],

  bardTwoDims: [
    {
      name: 'item',
      longName: 'Item',
      cardinality: 100,
      category: 'Personal',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'container',
      longName: 'Container',
      cardinality: 100,
      category: 'Personal',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'location',
      longName: 'Location',
      cardinality: 100,
      category: 'World',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'requirement',
      longName: 'Requirement',
      cardinality: 100,
      category: 'World',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'recipe',
      longName: 'Recipe',
      cardinality: 100,
      category: 'Personal',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
    {
      name: 'displayCurrency',
      longName: 'Display Currency',
      cardinality: 34,
      category: 'Personal',
      datatype: 'text',
      storageStrategy: 'loaded',
      fields: defaultFields,
    },
  ],
};
