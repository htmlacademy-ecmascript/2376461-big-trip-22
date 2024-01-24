function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Устанавливает заглавную букву строке: taxi - Taxi
 * @param {string} str Строка
 */
const typeNameNormalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
/**
 * Получить массив значений ключа
 * @param {string} key Ключ по которому будет собран массив
 * @param {Array} arr Массив обьектов
 */
const getAllKeyValue = (key,arr) => arr.map((item) => item[key]);
/**
 * Получить item из массива указав его id
 * @param {Number} id id по которому будет найден item
 * @param {Array} arr Массив обьектов
 */
const getItemById = (id,arr) => arr.find((item) => item.id === id);

//обновление элементов в массиве объектов
function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export { getRandomArrayElement, typeNameNormalize, getAllKeyValue, getItemById, updateItem };
