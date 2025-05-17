export const getObjectTypeName = (type: string): string => {
  const types: { [key: string]: string } = {
    'BUILDING': 'Здание',
    'ENTRANCE': 'Подъезд',
    'BASEMENT_FLOOR': 'Цокольный этаж',
    'FLOOR': 'Этаж',
    'STAIRWELL': 'Лестничный пролет',
    'ELEVATOR': 'Лифт',
    'FLOOR_BALCONY': 'Балкон этажа',
    'CORRIDOR': 'Коридор',
    'ELEVATOR_HALL': 'Холл лифта',
    'APARTMENT': 'Квартира',
    'APARTMENT_BALCONY': 'Балкон квартиры',
    'ROOM': 'Комната',
    'TASK': 'Задача'
  };
  return types[type] || type;
}; 