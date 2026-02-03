function getCategoryName(category) {
  const categories = {
    children: 'Дети',
    urgent: 'Срочные',
    operations: 'Операции',
    animals: 'Животные',
    social: 'Социальные программы',
    non_material: 'Не материальная помощь'
  };
  return categories[category] || category;
}