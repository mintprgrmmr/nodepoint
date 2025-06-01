Ext.define('NodePoint.store.City', {
  extend: 'Ext.data.Store',
  requires: ['NodePoint.model.City'],
  model: 'NodePoint.model.City',
  autoLoad: true,

  proxy: { type: 'memory' }, 
  
  constructor: function (config) {
    config = config || {};
    config.data = JSON.parse(localStorage.getItem('city-store') || '[]');
    this.callParent([config]);
  }
});

