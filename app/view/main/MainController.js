Ext.define('NodePoint.view.main.MainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.main',

  init() {
    const view = this.getView();
    const cityGrid = view.down('grid[title=\"Города\"]');
    const streetGrid = view.down('grid[title=\"Улицы\"]');
    const cityStore = cityGrid.getStore();
    const streetStore = streetGrid.getStore();

    // Загрузка данных из localStorage
    cityStore.setData(NodePoint.utils.StorageService.load('city-store'));
    streetStore.setData(NodePoint.utils.StorageService.load('street-store'));

    // Фильтрация улиц по выбранному городу
    cityGrid.getSelectionModel().on('selectionchange', (_, selection) => {
      const selectedCity = selection[0];
      if (selectedCity) {
        const cityId = selectedCity.getId();
        streetStore.clearFilter();
        streetStore.filter('cityId', cityId);
      } else {
        streetStore.clearFilter();
      }
    });

    this.updateLastSavedDisplay();
  },

  saveToLocalStorage(key, store) {
    NodePoint.utils.StorageService.save(key, store.getData().items.map(r => r.data));
    this.updateLastSavedDisplay();
  },

  updateLastSavedDisplay() {
    const view = this.getView();
    const display = view.down('#lastSavedDisplay');
    const savedAt = NodePoint.utils.StorageService.getSavedAt('city-store');
    if (display && savedAt) {
      const formatted = savedAt.toLocaleString();
      display.setHtml(`Последнее сохранение: ${formatted}`);
    } else if (display) {
      display.setHtml('Последнее сохранение: —');
    }
  },

  onPreloadClick() {
    const demoCities = [
      { id: 1, name: 'Москва', region: 'Центральный' },
      { id: 2, name: 'Санкт-Петербург', region: 'Северо-Западный' },
      { id: 3, name: 'Новосибирск', region: 'Сибирский' },
      { id: 4, name: 'Екатеринбург', region: 'Уральский' },
      { id: 5, name: 'Казань', region: 'Приволжский' },
      { id: 6, name: 'Владивосток', region: 'Дальневосточный' }
    ];

    const demoStreets = [
      { name: 'Тверская улица', company: 'ЖКХ Москва', houses: 25, population: 1000, cityId: 1 },
      { name: 'Арбат', company: 'ЖКХ Центр', houses: 10, population: 500, cityId: 1 },
      { name: 'Невский проспект', company: 'Санкт ЖКХ', houses: 40, population: 1500, cityId: 2 },
      { name: 'Красный проспект', company: 'СибКомСервис', houses: 15, population: 700, cityId: 3 },
      { name: 'Малышева', company: 'Урал ЖКХ', houses: 18, population: 800, cityId: 4 },
      { name: 'Баумана', company: 'Казань ГородСервис', houses: 12, population: 600, cityId: 5 },
      { name: 'Светланская', company: 'Владивосток Сервис', houses: 20, population: 900, cityId: 6 }
    ];

    NodePoint.utils.StorageService.preloadDemo('city-store', 'street-store', demoCities, demoStreets);

    const view = this.getView();
    const cityGrid = view.down('grid[title=\"Города\"]');
    const streetGrid = view.down('grid[title=\"Улицы\"]');

    cityGrid.getStore().setData(demoCities);
    streetGrid.getStore().setData(demoStreets);

    cityGrid.getSelectionModel().deselectAll();
    streetGrid.getStore().clearFilter();

    this.updateLastSavedDisplay();
  },

  onResetClick() {
    NodePoint.utils.StorageService.clear('city-store');
    NodePoint.utils.StorageService.clear('street-store');

    const view = this.getView();
    const cityGrid = view.down('grid[title=\"Города\"]');
    const streetGrid = view.down('grid[title=\"Улицы\"]');

    cityGrid.getStore().removeAll();
    streetGrid.getStore().removeAll();

    cityGrid.getSelectionModel().deselectAll();
    this.updateLastSavedDisplay();
  },

  onExportClick() {
    const data = NodePoint.utils.StorageService.exportAll('city-store', 'street-store');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'nodepoint_data.json';
    a.click();

    URL.revokeObjectURL(url);
  },

  onImportClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          NodePoint.utils.StorageService.importAll('city-store', 'street-store', json);

          const view = this.getView();
          view.down('grid[title=\"Города\"]').getStore().setData(json.cities || []);
          view.down('grid[title=\"Улицы\"]').getStore().setData(json.streets || []);

          this.updateLastSavedDisplay();
        } catch (e) {
          console.error('Ошибка импорта данных:', e);
        }
      };

      reader.readAsText(file);
    });

    input.click();
  }
});
