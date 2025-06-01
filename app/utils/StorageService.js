Ext.define('NodePoint.utils.StorageService', {
  singleton: true,

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_savedAt`, new Date().toISOString());
    } catch (e) {
      console.error(`Ошибка при сохранении ${key}:`, e);
    }
  },

  load(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  clear(key) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_savedAt`);
  },

  getSavedAt(key) {
    const raw = localStorage.getItem(`${key}_savedAt`);
    return raw ? new Date(raw) : null;
  },

  exportAll(cityKey, streetKey) {
    return {
      cities: this.load(cityKey),
      streets: this.load(streetKey)
    };
  },

  importAll(cityKey, streetKey, data) {
    this.save(cityKey, data.cities || []);
    this.save(streetKey, data.streets || []);
  },

  preloadDemo(cityKey, streetKey, demoCities, demoStreets) {
    this.save(cityKey, demoCities);
    this.save(streetKey, demoStreets);
  }
});
