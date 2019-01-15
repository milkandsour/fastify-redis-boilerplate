const root = '../../';
const { version } = require(`${root}package.json`);
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const server = require(`${root}src/server`);

describe("Vectors (functional/reviews.get.js)", (suite) => {

  before(async () => {
    this.server = chai.request(`http://0.0.0.0:${process.env.SERVER_PORT || 3001}`);
    const [major] = version.split('.');
    this.route = `/v${major}/reviews`;
  })

  describe(`GET reviews`, () => {
    it('No accomodation @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).send();
      chai.expect(res).to.have.status(400);
    })

    it('With accomodation and defaults @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e'
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(10);
    })

    it('With accomodation category FAMILY and limit @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        along: 'FAMILY',
        limit: 1000,
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(118);
    })

    it('With accomodation category FAMILY and limit @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        along: 'SINGLE',
        limit: 1000,
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(1);
    })

    it('With accomodation, category, limit, from @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        along: 'COUPLE',
        limit: 1000,
        from: 1403211999143,
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(12);
    })

    it('With accomodation, limit, from @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        limit: 1000,
        from: 1403211999143,
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(174);
    })

    it('With accomodation category COUPLE, limit, to @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        along: 'COUPLE',
        limit: 1000,
        to: 1403211999143,
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(4);
    })

    it('With accomodation category FAMILY, limit, to @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        limit: 1000,
        to: 1403211999143,
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(26);
    })

    it('With accomodation, limit, from, to and order  @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        limit: 1000,
        from: 1403211999143,
        to: 1203211999143,
        order: 'submissions',
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(138);
    })

    it('With accomodation category FAMILY, limit, from, to and order  @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        limit: 1000,
        order: 'submissions',
        from: 1403211999143,
        to: 1203211999143,
        along: 'FAMILY',
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(97);
    })

    it('With accomodation category FAMILY, from and to and order  @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        order: 'submissions',
        from: 1403211999143,
        to: 1203211999143,
        along: 'FAMILY',
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(10);
    })

    it('With accomodation category FAMILY, limit 20, from, to and order  @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        order: 'submissions',
        from: 1403211999143,
        to: 1203211999143,
        along: 'FAMILY',
        limit: 20,
      }).send();
      chai.expect(res).to.have.status(200);
      chai.expect(res.body.collection).to.have.length(20);
    })

    it('sorted with limit @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        from: 1403211999143,
        to: 1203211999143,
        along: 'FAMILY',
        limit: 20,
      }).send();
      chai.expect(res).to.have.status(200);
      const { body } = res;
      const { collection } = body;
      collection.forEach((review, index) => {
        const { length } = collection;
        if (index + 1 >= length) return;
        chai.expect(review.travel).to.be.least(collection[index + 1].travel);
      })
    })

    it('sorted @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        from: 1403211999143,
        to: 1203211999143,
        along: 'FAMILY',
      }).send();
      chai.expect(res).to.have.status(200);
      const { body } = res;
      const { collection } = body;
      collection.forEach((review, index) => {
        const { length } = collection;
        if (index + 1 >= length) return;
        chai.expect(review.travel).to.be.least(collection[index + 1].travel);
      })
    })

    it('sorted with submissions order @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        order: 'submissions',
      }).send();
      chai.expect(res).to.have.status(200);
      const { body } = res;
      const { collection } = body;
      collection.forEach((review, index) => {
        const { length } = collection;
        if (index + 1 >= length) return;
        chai.expect(review.submission).to.be.least(collection[index + 1].submission);
      })
    })

    it('keys in payload order @sc-2053 @acceptance @reviews', async () => {
      const { server, route } = this;
      const res = await server.get(route).query({
        accomodation: '96e83a90-48da-4e81-9d06-7f1b76e5364e',
        order: 'submissions',
      }).send();
      chai.expect(res).to.have.status(200);
      const { body } = res;
      chai.expect(Object.keys(body)).to.be.deep.equal(['collection', 'scores']);
    })


  })


})
