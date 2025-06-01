Ext.onReady(function () {
  if (Ext.Date) {
    Ext.Date.monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    Ext.Date.dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда',
                         'Четверг', 'Пятница', 'Суббота'];
  }

  if (Ext.grid) {
    Ext.grid.header.Container.prototype.sortAscText = 'Сортировать по возрастанию';
    Ext.grid.header.Container.prototype.sortDescText = 'Сортировать по убыванию';
    Ext.grid.header.Container.prototype.columnsText = 'Колонки';
  }

  if (Ext.view.AbstractView) {
    Ext.view.AbstractView.prototype.loadingText = 'Загрузка...';
    Ext.view.AbstractView.prototype.emptyText = 'Нет данных';
  }
});
