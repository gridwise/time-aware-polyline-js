var should = require('chai').should(),
    polyline = require('../index'),
    decoder = polyline.decodeTimeAwarePolyline;

var points = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.13597, 72.92495, '2016-07-21T05:43:15.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:21.000Z']
];

var polyline = 'spxsBsdb|Lymo`qvAx@TKvAr@K'

describe('#decoder', function() {
  it('decodes polyline', function() {
    decoder(polyline).should.deep.equal(points);
  });
});
