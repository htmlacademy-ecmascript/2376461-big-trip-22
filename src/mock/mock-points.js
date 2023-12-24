import { getRandomArrayElement } from '../utils.js';

const wayPoints = [
  {
    type: 'bus',
    destination: 'dest-id-1',
    timeDateStart: new Date('2023-12-14T00:00:00.000Z'),//день/месяц/год часы:минуты  flatpicker: d/m/Y h:i
    timeDateEnd: new Date('2023-12-15T00:00:00.000Z'),
    price: 399,
    isFavorite: false,
    offers: [0],
  },
  {
    type: 'taxi',
    destination: 'dest-id-2',
    timeDateStart: new Date('2023-12-14T00:00:00.000Z'),
    timeDateEnd: new Date('2023-12-15T00:00:00.000Z'),
    price: 929,
    isFavorite: false,
    offers: [1,0],
  },
  {
    type: 'drive',
    destination: 'dest-id-3',
    timeDateStart: new Date('2023-12-14T00:00:00.000Z'),
    timeDateEnd: new Date('2023-12-15T00:00:00.000Z'),
    price: 199,
    isFavorite: false,
    offers: [0,1],
  },
  {
    type: 'ship',
    destination: 'dest-id-4',
    timeDateStart: new Date('2023-12-14T00:00:00.000Z'),
    timeDateEnd: new Date('2023-12-15T00:00:00.000Z'),
    price: 299,
    isFavorite: true,
    offers: [1],
  },
  {
    type: 'restaurant',
    destination: 'dest-id-5',
    timeDateStart: new Date('2023-12-14T00:00:00.000Z'),
    timeDateEnd: new Date('2023-12-15T00:00:00.000Z'),
    price: 499,
    isFavorite: true,
    offers: [],
  },
];

const offersInType = [
  {
    type: 'bus',
    offers: [
      {
        id: 0,
        title: 'bus upgrade 1',
        price: '31'
      },
      {
        id: 1,
        title: 'bus upgrade 2',
        price: '34'
      },
      {
        id: 2,
        title: 'bus upgrade 3',
        price: '33'
      },
    ],
  },
  {
    type: 'taxi',
    offers: [
      {
        id: 0,
        title: 'taxi upgrade 1',
        price: '320'
      },
      {
        id: 1,
        title: 'taxi upgrade 2',
        price: '330'
      },
      {
        id: 2,
        title: 'taxi upgrade 3',
        price: '310'
      },
    ],
  },
  {
    type: 'drive',
    offers: [
      {
        id: 0,
        title: 'drive upgrade 1',
        price: '304'
      },
      {
        id: 1,
        title: 'drive upgrade 2',
        price: '20'
      },
      {
        id: 2,
        title: 'drive upgrade 3',
        price: '10'
      },
      {
        id: 3,
        title: 'drive upgrade 4',
        price: '40'
      },
    ],
  },
  {
    type: 'ship',
    offers: [
      {
        id: 0,
        title: 'ship upgrade 1',
        price: '50'
      },
      {
        id: 1,
        title: 'ship upgrade 2',
        price: '30'
      },
    ],
  },
  {
    type: 'restaurant',
    offers: [],
  },
];

const destinations = [
  {
    id: 'dest-id-1',
    description: 'Monika destination',
    name: 'Monika',
    pictures: []
  },
  {
    id: 'dest-id-2',
    description: 'Mongolia destination',
    name: 'Mongolia',
    pictures: [
      {
        src: 'img/photos/2.jpg',
        description: 'description for image',
      }
    ]
  },
  {
    id: 'dest-id-3',
    description: 'USA destination',
    name: 'USA',
    pictures: [
      {
        src: 'img/photos/3.jpg',
        description: 'description for image',
      },
      {
        src: 'img/photos/3.jpg',
        description: 'description for image',
      },
    ]
  },
  {
    id: 'dest-id-4',
    description: 'Thailand destination',
    name: 'Thailand',
    pictures: [
      {
        src: 'img/photos/4.jpg',
        description: 'description for image',
      },
      {
        src: 'img/photos/4.jpg',
        description: 'description for image',
      },
    ]
  },
  {
    id: 'dest-id-5',
    description: 'Home destination',
    name: 'Home',
    pictures: [
      {
        src: 'img/photos/1.jpg',
        description: 'description for image',
      },
      {
        src: 'img/photos/2.jpg',
        description: 'description for image',
      },
    ]
  },
];

function getRandomPoint() {
  return getRandomArrayElement(wayPoints);
}
function getOffersInType(){
  return offersInType;
}
function getDestinationsMock(){
  return destinations;
}
export { getRandomPoint, getOffersInType, getDestinationsMock };
