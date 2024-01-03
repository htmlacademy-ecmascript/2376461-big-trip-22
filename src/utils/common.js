function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Устанавливает заглавную букву строке: taxi - Taxi
 * @param {string} str Строка
 */
const typeNameNormalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


export { getRandomArrayElement, typeNameNormalize };
