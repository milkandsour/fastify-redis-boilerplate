module.exports = {
  get: {
    params: {
      type: 'object',
      properties: {},
      maxProperties: 0,
    },
    querystring: {
      type: 'object',
      properties: {
        along: { type: 'string', enum: ['FAMILY', 'OTHER', 'FRIENDS', 'COUPLE', 'SINGLE'] },
        order: { type: 'string', enum: ['submissions', 'travels'] },
        accomodation: { type: 'string', format: 'uuid' },
        offset: { type: 'integer', minimum: 0 },
        limit: { type: 'integer', minimum: 1 },
        from: { type: 'integer', minimum: (new Date(1990, 0, 0)).getTime() },
        to: { type: 'integer', minimum: (new Date(1990, 0, 0)).getTime() },
      },
      required: ['accomodation'],
    },
  },
};
