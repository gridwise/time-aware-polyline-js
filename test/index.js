var should = require('chai').should(),
    polyline = require('../index'),
    decoder = polyline.decodeTimeAwarePolyline;

describe('#decoder', function() {
  it('decodes polyline', function() {
    decoder('spxsBsdb|Lymo`qvAx@TKvAr@K')[0][0].should.equal(19.13626);
  });
});
