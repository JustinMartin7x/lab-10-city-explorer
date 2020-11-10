require('dotenv').config();

const { expect } = require('@jest/globals');
const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const { mungeLocation, mungeWeather, mungeTrails, mungeReviews } = require('../ustil')

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

    test('takes in location object and returns new munged object', () => {

      const oldData = [{
        'place_id': '282983083',
        'licence': 'https://locationiq.com/attribution',
        'osm_type': 'relation',
        'osm_id': '186579',
        'boundingbox': [
          '45.432536',
          '45.6528812',
          '-122.8367489',
          '-122.4720252'
        ],
        'lat': '45.5202471',
        'lon': '-122.6741949',
        'display_name': 'Portland, Multnomah County, Oregon, USA',
        'class': 'place',
        'type': 'city',
        'importance': 0.75356571743377,
        'icon': 'https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png'
      }];

      const expectation = {
        'formatted_query': 'Portland, Multnomah County, Oregon, USA',
        'latitude': '45.5202471',
        'longitude': '-122.6741949',
      };

      const data = mungeLocation(oldData);

      expect(data).toEqual(expectation);

    });

    test('expected to take in trails data and return munged data', async () => {
      const oldDataHiking = {
        'trails': [
          {
            'id': 7005246,
            'name': 'Enchantments Traverse',
            'type': 'Recommended Route',
            'summary': 'An extraordinary hike that takes you through all of the beauty that the Enchantments have to offer!',
            'difficulty': 'black',
            'stars': 4.9,
            'starVotes': 77,
            'location': 'Leavenworth, Washington',
            'url': 'https://www.hikingproject.com/trail/7005246/enchantments-traverse',
            'imgSqSmall': 'https://cdn2.apstatic.com/photos/hike/7032015_sqsmall_1554932324.jpg',
            'imgSmall': 'https://cdn2.apstatic.com/photos/hike/7032015_small_1554932324.jpg',
            'imgSmallMed': 'https://cdn2.apstatic.com/photos/hike/7032015_smallMed_1554932324.jpg',
            'imgMedium': 'https://cdn2.apstatic.com/photos/hike/7032015_medium_1554932324.jpg',
            'length': 19.1,
            'ascent': 4556,
            'descent': -6674,
            'high': 7795,
            'low': 1319,
            'longitude': -120.8206,
            'latitude': 47.5278,
            'conditionStatus': 'All Clear',
            'conditionDetails': 'Dry',
            'conditionDate': '2020-10-13 14:06:06'
          }
        ]
      };


      const expectation =
        [{
          'name': 'Enchantments Traverse',
          'location': 'Leavenworth, Washington',
          'length': 19.1,
          'stars': 4.9,
          'star_votes': 77,
          'summary': 'An extraordinary hike that takes you through all of the beauty that the Enchantments have to offer!',
          'trail_url': 'https://www.hikingproject.com/trail/7005246/enchantments-traverse',
          'conditions': 'Dry',
          'condition_date': '2020-10-13',
          'condition_time': '14:06:06'

        }];

      const newDataHiking = mungeTrails(oldDataHiking);

      expect(newDataHiking).toEqual(expectation);
    });


    test('take in the weather data and return munged weather', async () => {
      const oldDataWeather = {
        'data': [
          {
            'moonrise_ts': 1604988223,
            'wind_cdir': 'SSE',
            'rh': 89,
            'pres': 1004.07,
            'high_temp': 20.6,
            'sunset_ts': 1605045728,
            'ozone': 234.281,
            'moon_phase': 0.163076,
            'wind_gust_spd': 6.6,
            'snow_depth': 0,
            'clouds': 42,
            'ts': 1604984460,
            'sunrise_ts': 1605008675,
            'app_min_temp': 11.1,
            'wind_spd': 1.45996,
            'pop': 20,
            'wind_cdir_full': 'south-southeast',
            'slp': 1021.7,
            'moon_phase_lunation': 0.86,
            'valid_date': '2020-11-10',
            'app_max_temp': 20.7,
            'vis': 17.7684,
            'dewpt': 14.4,
            'snow': 0,
            'uv': 3.40157,
            'weather': {
              'icon': 'c03d',
              'code': 803,
              'description': 'Broken clouds'
            },
            'wind_dir': 166,
            'max_dhi': null,
            'clouds_hi': 0,
            'precip': 0.125,
            'low_temp': 15.9,
            'max_temp': 21.1,
            'moonset_ts': 1605039139,
            'datetime': '2020-11-10',
            'temp': 16.5,
            'min_temp': 11,
            'clouds_mid': 0,
            'clouds_low': 42
          }]
      };


      const expectation =
        [{
          'forecast': 'Broken clouds',
          'time': '2020-11-10'
        }];

      const newWeatherData = mungeWeather(oldDataWeather);

      expect(newWeatherData).toEqual(expectation);
    });

    test('take in yelp data and return munged data', async () => {
      const oldYelpData = {
        'businesses': [
          {
            'id': '6I28wDuMBR5WLMqfKxaoeg',
            'alias': 'pike-place-chowder-seattle',
            'name': 'Pike Place Chowder',
            'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/ZyQjV-wJQ2GHyX7l3jfbyg/o.jpg',
            'is_closed': false,
            'url': 'https://www.yelp.com/biz/pike-place-chowder-seattle?adjust_creative=-gcPOZeZfaB-PZ8QH7ORnw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=-gcPOZeZfaB-PZ8QH7ORnw',
            'review_count': 7395,
            'categories': [
              {
                'alias': 'seafood',
                'title': 'Seafood'
              },
              {
                'alias': 'soup',
                'title': 'Soup'
              }
            ],
            'rating': 4.5,
            'coordinates': {
              'latitude': 47.60939,
              'longitude': -122.34112
            },
            'transactions': [
              'delivery',
              'pickup'
            ],
            'price': '$$',
            'location': {
              'address1': '1530 Post Aly',
              'address2': 'Ste 11',
              'address3': '',
              'city': 'Seattle',
              'zip_code': '98101',
              'country': 'US',
              'state': 'WA',
              'display_address': [
                '1530 Post Aly',
                'Ste 11',
                'Seattle, WA 98101'
              ]
            },
            'phone': '+12062672537',
            'display_phone': '(206) 267-2537',
            'distance': 1031.7669014536564
          }
        ]
      };


      const expectation =
        [{
          'name': 'pike-place-chowder-seattle',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/ZyQjV-wJQ2GHyX7l3jfbyg/o.jpg',
          'price': '$$',
          'rating': 4.5,
          'url': 'https://www.yelp.com/biz/pike-place-chowder-seattle?adjust_creative=-gcPOZeZfaB-PZ8QH7ORnw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=-gcPOZeZfaB-PZ8QH7ORnw'
        }];

      const newYelpData = mungeReviews(oldYelpData);

      expect(newYelpData).toEqual(expectation);
    });




  });
});
