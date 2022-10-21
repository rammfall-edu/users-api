import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { faker } from '@faker-js/faker';

const server = fastify({ logger: true });

const initAddons = async () => {
  await server.register(fastifyCors);
  await server.register(fastifySwagger);
  await server.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  return server;
};

initAddons()
  .then((server) => {
    server.get(
      '/users',
      {
        schema: {
          description: 'Response users',
          tags: ['users'],
          summary: 'Response users',
          response: {
            200: {
              type: 'array',
              maxItems: 40,
              description: 'Successful response',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  photo: {
                    type: 'string',
                  },
                  position: {
                    type: 'string',
                  },
                },
                required: ['position', 'photo', 'name'],
              },
            },
          },
        },
      },
      (request, reply) => {
        class User {
          constructor() {
            this.name = faker.name.fullName();
            this.photo = faker.image.avatar();
            this.position = faker.name.jobTitle();
          }
        }
        const users = new Array(40).fill(null).map(() => new User());

        reply.send(users);
      }
    );

    return server.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0',
    });
  })
  .catch((err) => console.error(err));
