function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const typeNameNormalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);// taxi - Taxi

export { getRandomArrayElement,typeNameNormalize };
