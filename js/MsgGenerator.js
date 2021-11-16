const faker = require('faker');

faker.locale = 'ru';

class MsgGenerator {
  constructor() {
    this.messages = [];
    this.timeout = null;
    this.limit = 100;
    this.isFinish = false;
  }

  start() {
    const delay = Math.floor(Math.random() * (4000 - 200)) + 200;

    this.timeout = setTimeout(() => {
      const message = {
        id: faker.datatype.uuid(),
        from: faker.internet.email(),
        subject: faker.lorem.words(),
        body: faker.lorem.paragraph(),
        received: Date.now(),
      };

      this.messages.push(message);

      if (this.messages.length === this.limit) {
        clearTimeout(this.timeout);
        // eslint-disable-next-line no-console
        console.log('Генерация сообщений завершена.');
      } else this.start();
    }, delay);
  }

  getLastMessages(id) {
    if (!id) return this.messages;

    const index = this.messages.findIndex((msg) => msg.id === id);

    if (index + 1 === this.limit) this.isFinish = true;
    return this.messages.slice(index + 1, this.messages.length);
  }
}

module.exports = MsgGenerator;
