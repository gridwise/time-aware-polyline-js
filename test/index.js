var should = require('chai').should(),
    polyline = require('../index'),
    decoder = polyline.decodeTimeAwarePolyline,
    encoder = polyline.encodeTimeAwarePolyline,
    locationFinder = polyline.getLocationsAtTimestamps;

var points = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.13597, 72.92495, '2016-07-21T05:43:15.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:21.000Z']
];

var polyline = 'spxsBsdb|Lymo`qvAx@TKvAr@K';

var timeStampsToFind = [
    '2016-07-21T05:43:21.000Z', // exact match with third
    '2016-07-21T05:43:11.000Z', // between first and second
    '2016-07-21T05:43:41.000Z', // after last time
    '2016-07-21T05:43:08.000Z', // before first time
];

var locationsFound = [
    [19.13553, 72.92469],
    [19.136163333333336, 72.92502333333334],
    [19.13553, 72.92469],
    [19.13626, 72.92506],
];

describe('#decoder', function() {
  it('decodes polyline', function() {
    decoder(polyline).should.deep.equal(points);
  });

  it('finds locations', function() {
    locationFinder(
      polyline, timeStampsToFind
    ).should.deep.equal(locationsFound);
  })
});

describe('#encoder', function() {
  it('encodes polyline', function() {
    encoder(points).should.equal(polyline);
  });
});
