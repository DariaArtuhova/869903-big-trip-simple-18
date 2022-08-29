import {getRandomInteger} from '../utils/common';
import {OFFERS, MIN_VALUE_ID_DESTINATION, MAX_VALUE_ID_DESTINATION, MIN_VALUE_PRICE, MAX_VALUE_PRICE} from '../const';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

export const generateOffers = () => {
  const offers = OFFERS;
  const offerIndex = getRandomInteger(0, offers.length - 1);
  return offers[offerIndex];
};

export const generateType = () => {
  const type = [
    'Taxi',
    'Bus',
    'Train',
    'Ship',
    'Drive',
    'Flight',
    'Check-in',
    'Sightseeing',
    'Restaurant',
  ];

  const randomIndex = getRandomInteger(0, type.length - 1);

  return type[randomIndex];
};

const generateCity = () => {
  const cities = [
    'Moscow',
    'Paris',
    'London',
    'Ufa',
    'New York',
    'Amsterdam',
    'New City',
    'Sochi',
  ];

  const randomIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomIndex];
};

const generateDateFrom = () => {
  const timeDifference = 10;
  const daysGap = getRandomInteger(-timeDifference, timeDifference);

  return dayjs().add(daysGap,'day').toDate();

};

const generateHoursFrom = () => {
  const timeDifference = 10;
  const daysGap = getRandomInteger(-timeDifference, timeDifference);

  return dayjs().add(daysGap,'hours').toDate();

};


export const generatePoint = () => ({
  id: nanoid(),
  type: generateType(),
  city:generateCity(),
  dateFrom: generateDateFrom(),
  dateTo: generateDateFrom(),
  price: getRandomInteger(MIN_VALUE_PRICE, MAX_VALUE_PRICE),
  offers: getRandomInteger(1, 3),
  destination: getRandomInteger(MIN_VALUE_ID_DESTINATION, MAX_VALUE_ID_DESTINATION),
  hoursFrom: generateHoursFrom(),
  hoursTo: generateHoursFrom(),

});

