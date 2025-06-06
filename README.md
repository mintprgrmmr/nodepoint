# NodePoint – Менеджер геоданных

NodePoint — это SPA-приложение на ExtJS для управления геоданными. Проект реализует таблицы городов и улиц, с возможностью добавления, редактирования, удаления и связки между ними.

## 🚀 Возможности
- Две связанные таблицы: **Города** и **Улицы**
- Добавление и редактирование записей прямо из таблиц (RowEditing)
- Привязка улиц к конкретным городам через `cityId`
- Сохранение данных в **localStorage**
- Импорт и экспорт данных в формате JSON
- Загрузка демонстрационных данных по кнопке
- Отображение времени последнего сохранения
- Переключение между светлой и тёмной темами
- Пользовательский выбор тем оформления (classic, gray, crisp, neptune, triton)
- Визуальное разделение информации в тулбаре

⚙️ В ближайшее время:
- Реализация полнофункциональной тёмной темы (в процессе)

## 🛠️ Стек
- **ExtJS 6.0.0 (GPL)**
- Архитектура **MVC + Utilities**
- **localStorage** для хранения данных
- Минималистичная кастомная тема и иконки (Font Awesome)

## 📁 Структура
app/
├── model/ # Модели данных (City.js, Street.js)
├── store/ # Хранилища Ext.data.Store
├── utils/ # Утилиты (StorageService.js)
├── view/
│ ├── main/ # Основной интерфейс (Main.js, MainController.js)
│ └── window/ # Дополнительные окна (если будут)
├── Application.js # Точка входа
tests/
├── StorageService.test.js
resources/
├── css/ # Глобальные стили (themeSwitcher и др.)
index.html

## 🧪 Тестирование
- Покрытие модулей юнит-тестами (начато с `StorageService.js`)
- Используется встроенный `assert` + `Node.js` без сторонних библиотек

## 📌 Особенности
- Поддержка полной локальной работы, без сервера
- Модульная структура с возможностью масштабирования
- Чистая и читаемая архитектура (удобна для поддержки и доработок)

## 📝 Заметки
Проект разработан с нуля для портфолио и в качестве демонстрации навыков работы с ExtJS, архитектурой и интерфейсами.

## ▶️ Запуск проекта

### Через `npx` (рекомендуется)

1. Установить зависимости для локального сервера :
 ```bash
   npm install serve
 ```
2. Запустить локальный сервер из корня проекта:
 ```bash
    npx serve
 ```

3. Перейти в браузере:
http://localhost:3000

### Через .bat-файл (Windows)
Можно использовать готовый файл start-nodepoint.bat:
 ```bat
 cd /d D:\PROJECTS\NODEPOINT
 http-server
 pause
 ```

⚠️ Требует глобальной установки:
 ```bash
 npm install -g http-server
 ```

⚠️ Не рекомендуется открывать `index.html` напрямую через файловую систему (двойной клик),
так как это может нарушить работу интерфейса (темы, загрузка данных и другие функции).

