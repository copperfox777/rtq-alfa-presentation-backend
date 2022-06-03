const { faker } = require('@faker-js/faker');

const users = Array.from({ length: 20 }, (_, idx) => ({
  id: idx + 1,
  name: faker.name.firstName() + " " + faker.name.lastName(),
  avatar: faker.image.avatar(),
  job: faker.name.jobTitle()
}));

const posts = Array.from({ length: 20 * 20 }, (_, idx) => ({
  id: idx + 1,
  userId: Math.floor(idx / 20) + 1,
  title: faker.lorem.sentence(),
  text: faker.lorem.paragraph(),
  image: faker.image.cats(),
}));

module.exports = {users,posts}