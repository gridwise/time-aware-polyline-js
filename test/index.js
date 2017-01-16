var should = require('chai').should(),
polyline = require('../index'),
decoder = polyline.decodeTimeAwarePolyline,
encoder = polyline.encodeTimeAwarePolyline,
locationFinder = polyline.getLocationsAtTimestamps,
getLocationsElapsed = polyline.getLocationsElapsedByTimestamp,
getPolylineSegments = polyline.getPolylineSegments;

var points = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.13597, 72.92495, '2016-07-21T05:43:15.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:21.000Z']
];

var pointsWithDuplicates = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.13597, 72.92495, '2016-07-21T05:43:15.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:21.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:22.000Z'],
    [19.13553, 72.92469, '2016-07-21T05:43:23.000Z']
];

var encoded = 'spxsBsdb|Lymo`qvAx@TKvAr@K';

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

var timeStampToFind1 = timeStampsToFind[1];
var timeStampToFind2 = timeStampsToFind[0];

var locationsElapsed1 = [
    [19.13626, 72.92506],
    [19.136163333333336, 72.92502333333334]
];

var locationsElapsed2 = [
    [19.13626, 72.92506],
    [19.13597, 72.92495],
    [19.13553, 72.92469]
];

var locationsElapsedWithDuplicates = [
    [19.13626, 72.92506],
    [19.13597, 72.92495],
    [19.13553, 72.92469],
    [19.13553, 72.92469],
    [19.13553, 72.92469]
];

var timeStampForDuplicates = '2016-07-21T05:43:23.000Z';

describe('#decoder', function() {
    it('decodes polyline', function() {
        decoder(encoded).should.deep.equal(points);
    });

    it('finds locations', function() {
        locationFinder(
            points, timeStampsToFind
        ).should.deep.equal(locationsFound);
    });

    it('locations traveled', function() {
        getLocationsElapsed(
            points, timeStampToFind1
        ).should.deep.equal(
            {'path': locationsElapsed1, 'bearing': -160.28}
        );

        getLocationsElapsed(
            points, timeStampToFind2
        ).should.deep.equal(
            {'path': locationsElapsed2, 'bearing': -150.83}
        );

        getLocationsElapsed(
            pointsWithDuplicates, timeStampForDuplicates
        ).should.deep.equal(
            {'path': locationsElapsedWithDuplicates, 'bearing': -150.83}
        );
    });

    it('creates polyline segments', function() {
        getPolylineSegments(
            ''
        ).should.deep.equal(
            {'path': [], 'bearing': null}
        )
    });
});

describe('#encoder', function() {
    it('encodes polyline', function() {
        encoder(points).should.equal(encoded);
    });
});
