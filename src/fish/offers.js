import {getRandomInteger} from '../utils';
import {generateType} from './point';
import {generateOffers} from './point';

export const offer = [{
  id: 1,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 2,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 3,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 4,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 5,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 6,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},{
  id: 7,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
}
];
