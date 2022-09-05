import {getRandomInteger} from '../utils/common';
import {generateOffers} from './point';

export const offer = [{
  id: 1,
  type: 'taxi',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 2,
  type: 'bus',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 3,
  type: 'train',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 4,
  type: 'ship',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 5,
  type: 'flight',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 6,
  type: 'restaurant',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 7,
  type: 'sightseeing',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 7,
  type: 'check-in',
  title: generateOffers(),
  price: getRandomInteger(100,1000)
}
];
