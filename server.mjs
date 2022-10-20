import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { faker } from '@faker-js/faker';

const server = fastify({ logger: true });

server.register(fastifyCors);

server.get('/users', (request, reply) => {
  class User {
    constructor() {
      this.name = faker.name.fullName();
      this.photo = faker.image.avatar();
      this.position = faker.name.jobTitle();
    }
  }
  const users = new Array(40).fill(null).map(() => new User());

  reply.send(users);
});

server
  .listen({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
  })
  .catch((err) => console.error(err));
