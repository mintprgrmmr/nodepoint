Ext.define('NodePoint.view.main.Main', {
  extend: 'Ext.panel.Panel',
  xtype: 'main-view',

  header: {
    title: 'NODEPOINT – Менеджер геоданных',
    iconCls: 'fa fa-city',
    height: 40
  },

  requires: [
    'Ext.layout.container.HBox',
    'Ext.grid.Panel',
    'Ext.grid.plugin.RowEditing',
    'NodePoint.store.City',
    'NodePoint.store.Street',
    'NodePoint.view.main.MainController',
    'NodePoint.utils.StorageService'
  ],

  controller: 'main',

  layout: {
    type: 'hbox',
    align: 'stretch'
  },

  initComponent() {
    const me = this;
    const cityStore = Ext.create('NodePoint.store.City');
    const streetStore = Ext.create('NodePoint.store.Street');

    const makeGrid = (title, store, fields, addFn, key) => ({
      xtype: 'grid',
      title,
      flex: 1,
      margin: 5,
      store,
      viewConfig: {
        emptyText: 'Нет данных',
        deferEmptyText: false
      },
      columns: [
        ...fields.map(f => ({
          text: f.label,
          dataIndex: f.name,
          flex: 1,
          minWidth: 100,
          editor: f.editor || 'textfield'
        })),
        {
          xtype: 'actioncolumn',
          text: '<i class="fa fa-bolt" aria-hidden="true"></i>',
          width: 50,
          hideable: false,
          menuDisabled: true,
          items: [{
            iconCls: 'fa fa-trash',
            tooltip: 'Удалить',
            handler: (_, rowIndex) => {
              store.removeAt(rowIndex);
              me.getController().saveToLocalStorage(key, store);
              me.getController().updateLastSavedDisplay();
            }
          }]
        }
      ],
      tbar: [{
        xtype: 'button',
        text: `Добавить ${title.toLowerCase().slice(0, -1)}`,
        iconCls: 'fa fa-plus-square',
        handler: function () {
          const grid = this.up('grid');
          const plugin = grid.findPlugin('rowediting');
          const newRecord = store.insert(0, addFn())[0];

          Ext.defer(() => {
            grid.getView().refresh();
            grid.getSelectionModel().select(newRecord);
            plugin.startEdit(newRecord, 0);
          }, 50);

          me.getController().saveToLocalStorage(key, store);
          me.getController().updateLastSavedDisplay();
        }
      }],
      plugins: [{
        ptype: 'rowediting',
        clicksToEdit: 2,
        listeners: {
          edit: () => {
            me.getController().saveToLocalStorage(key, store);
            me.getController().updateLastSavedDisplay();
          }
        }
      }]
    });

    me.items = [
      makeGrid('Города', cityStore, [
        { name: 'name', label: 'Город' },
        { name: 'region', label: 'Регион' }
      ], () => ({ name: '', region: '' }), 'city-store'),

      makeGrid('Улицы', streetStore, [
        { name: 'name', label: 'Улица' },
        { name: 'company', label: 'Компания' },
        { name: 'houses', label: 'Дома', editor: 'numberfield' },
        { name: 'population', label: 'Население', editor: 'numberfield' },
        { name: 'cityId', label: 'ID города', editor: 'numberfield' }
      ], () => ({ name: '', company: '', houses: 0, population: 0, cityId: null }), 'street-store')
    ];

    me.dockedItems = [{
      xtype: 'toolbar',
      cls: 'nodepoint-toolbar',
      dock: 'top',
      items: [
        { text: 'Загрузить демо', handler: 'onPreloadClick', iconCls: 'fa fa-folder-open' },
        { text: 'Сбросить данные', handler: 'onResetClick', iconCls: 'fa fa-eraser' },
        { text: 'Импорт JSON', handler: 'onImportClick', iconCls: 'fa fa-calendar-plus' },
        { text: 'Экспорт JSON', handler: 'onExportClick', iconCls: 'fa fa-file-export' },
        '->',
        {
          xtype: 'container',
          layout: 'hbox',
          items: [
            {
              xtype: 'component',
              itemId: 'lastSavedDisplay',
              html: 'Последнее сохранение: —',
              style: 'margin: 0 10px 0 0; line-height: 22px;'
            },
            {
              xtype: 'box',
              style: 'width:1px;height:24px;background:#ccc;margin:0 10px;'
            },
            {
              xtype: 'component',
              html: `<div class="theme-preview-container">
                <label for="dark-mode-toggle">Тёмная тема</label>
                <input type="checkbox" id="dark-mode-toggle" style="margin-right: 10px;">
                <div class="theme-preview theme-classic" data-theme="theme-classic" title="Classic"></div>
                <div class="theme-preview theme-gray" data-theme="theme-gray" title="Gray"></div>
                <div class="theme-preview theme-crisp" data-theme="theme-crisp" title="Crisp"></div>
                <div class="theme-preview theme-neptune" data-theme="theme-neptune" title="Neptune"></div>
                <div class="theme-preview theme-triton" data-theme="theme-triton" title="Triton"></div>
              </div>`,
              listeners: {
                afterrender(cmp) {
                  const container = cmp.getEl().dom;
                  const themePreviews = container.querySelectorAll('.theme-preview');
                  const toggle = container.querySelector('#dark-mode-toggle');

                  const setTheme = (theme) => {
                    const oldLink = document.querySelector('#theme-link');
                    if (oldLink) oldLink.remove();

                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.id = 'theme-link';
                    link.href = `ext/build/classic/${theme}/resources/${theme}-all.css`;
                    document.head.appendChild(link);
                    localStorage.setItem('theme', theme);
                    highlightTheme(theme);
                  };

                  const setMode = (mode) => {
                    document.documentElement.setAttribute('data-mode', mode);
                    localStorage.setItem('mode', mode);
                  };

                  const highlightTheme = (theme) => {
                    themePreviews.forEach(el => {
                      el.classList.toggle('selected', el.dataset.theme === theme);
                    });
                  };

                  const currentTheme = localStorage.getItem('theme') || 'theme-crisp';
                  const currentMode = localStorage.getItem('mode') || 'light';
                  toggle.checked = currentMode === 'dark';
                  highlightTheme(currentTheme);
                  setMode(currentMode);
                  setTheme(currentTheme);

                  toggle.addEventListener('change', () => {
                    const mode = toggle.checked ? 'dark' : 'light';
                    setMode(mode);
                  });

                  themePreviews.forEach(el => {
                    el.addEventListener('click', () => {
                      const theme = el.dataset.theme;
                      if (theme) setTheme(theme);
                    });
                  });
                }
              }
            }
          ]
        }
      ]
    }];

    me.callParent(arguments);
  }
});
