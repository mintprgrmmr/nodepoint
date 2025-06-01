Ext.define('NodePoint.store.Street', {
  extend: 'Ext.data.Store',
  requires: ['NodePoint.model.Street'], 
  model: 'NodePoint.model.Street',
  autoLoad: true,

  proxy: { type: 'memory' }, 

  constructor: function (config) {
    config = config || {};
    config.data = JSON.parse(localStorage.getItem('street-store') || '[]');
    this.callParent([config]);
  }
});
