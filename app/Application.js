Ext.define('NodePoint.Application', {
  extend: 'Ext.app.Application',
  name: 'NodePoint',

  requires: [
    'NodePoint.view.main.Main'
  ],

  launch() {
    // Попытка установить русскую локаль, если она поддерживается
    Ext.Loader.setPath('Ext.locale', 'ext/locale');

    // Загрузка локализованных компонентов (без вызова Ext.locale, т.к. это не функция)
    Ext.require([
      'Ext.locale.ru.*'
    ]);

    // Создание основного интерфейса
    Ext.create('Ext.container.Viewport', {
      layout: 'fit',
      items: [{ xtype: 'main-view' }]
    });
  }
});
