require('dotenv').config();

const { expect } = require('@jest/globals');
const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const { mungeLocation } = require('../ustil')

describe('app routes', () => {
  describe('routes', () => {
    // let token;

    // beforeAll(async done => {
    //   execSync('npm run setup-db');

    //   client.connect();


    //   const signInData = await fakeRequest(app)
    //     .post('/auth/signup')
    //     .send({
    //       email: 'jon@user.com',
    //       password: '1234'
    //     });

    //   token = signInData.body.token;

    //   return done();
    // });

    // afterAll(done => {
    //   return client.end(done);
    // });

    test.only('takes in location object and returns new munged object', () => {

      const oldData = {
        "place_id": "282983083",
        "licence": "https://locationiq.com/attribution",
        "osm_type": "relation",
        "osm_id": "186579",
        "boundingbox": [
          "45.432536",
          "45.6528812",
          "-122.8367489",
          "-122.4720252"
        ],
        "lat": "45.5202471",
        "lon": "-122.6741949",
        "display_name": "Portland, Multnomah County, Oregon, USA",
        "class": "place",
        "type": "city",
        "importance": 0.75356571743377,
        "icon": "https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png"
      };

      const expectation = {
        'formatted_query': 'Portland, Multnomah County, Oregon, USA',
        'latitude': '45.5202471',
        'longitude': '-122.6741949',
      };

      const data = mungeLocation(oldData);

      expect(data).toEqual(expectation);

    });
    test('return information on portland', async () => {

      const expectation =
      {
        'formatted_query': 'Portland, Multnomah County, Oregon, USA',
        'latitude': '45.5202471',
        'longitude': '-122.6741949',
      };

      const data = await fakeRequest(app)
        .get('/location/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });







  });
});
