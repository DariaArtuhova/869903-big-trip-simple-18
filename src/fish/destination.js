import {getRandomInteger} from '../utils/common';

const generatePicture = () => `http://picsum.photos/248/152?r=${getRandomInteger(1, 15)}`;


export const destinations = [{
  id: 1,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  name: 'Chamonix',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'Beautiful Mountains'
  }]
},
{
  id: 2,
  description: 'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  name: 'Rome',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'Italian Alps'
  }]
},
{
  id: 3,
  description: 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  name: 'Amsterdam',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'Mountains'
  }]
},
{
  id: 4,
  description: 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  name: 'Amsterdam',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'Mountains'
  }]
}
];
