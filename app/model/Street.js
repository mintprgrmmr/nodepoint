Ext.define('NodePoint.model.Street', {
  extend: 'Ext.data.Model',
  idProperty: 'id',
  fields: [
    'id',
    'name',
    'company',
    { name: 'houses', type: 'int' },
    { name: 'population', type: 'int' }
  ]
});