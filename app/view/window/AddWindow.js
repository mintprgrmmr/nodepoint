// Зарезервировано под общую реализацию всплывающих окон (Ext.window.Window)
// Пока не используется. Возможное применение — модальные окна для добавления/редактирования.

Ext.define('NodePoint.view.street.AddWindow', {
  extend: 'Ext.window.Window',
  xtype: 'add-street-window',
  title: 'Добавить улицу',
  modal: true,
  width: 300,
  layout: 'fit',

  items: {
    xtype: 'form',
    bodyPadding: 10,
    defaultType: 'textfield',
    items: [
      {
        name: 'name',
        fieldLabel: 'Название',
        allowBlank: false
      },
      {
        name: 'company',
        fieldLabel: 'Компания'
      },
      {
        xtype: 'numberfield',
        name: 'houses',
        fieldLabel: 'Количество домов',
        minValue: 0,
        value: 0
      }
    ]
  },

  buttons: [
    {
      text: 'Добавить',
      formBind: true,
      handler: function (btn) {
        const win = btn.up('window');
        const form = win.down('form');
        if (form.isValid()) {
          const values = form.getValues();
          values.houses = parseInt(values.houses) || 0;
          win.fireEvent('streetAdded', values);
          win.close();
        }
      }
    },
    {
      text: 'Отмена',
      handler: function (btn) {
        btn.up('window').close();
      }
    }
  ]
});
