var should = require('chai').should(),
polyline = require('../index'),
decoder = polyline.decodeTimeAwarePolyline,
encoder = polyline.encodeTimeAwarePolyline,
locationFinder = polyline.getLocationsAtTimestamps,
getLocationsElapsed = polyline.getLocationsElapsedByTimestamp,
getPolylineSegments = polyline.getPolylineSegmentsForLocationsElapsed;

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

var pointsToSplit = [
    [19.13626, 72.92506, '2016-07-21T05:43:09.000Z'],
    [19.13777, 72.92555, '2016-07-21T05:54:09.000Z'],
    [19.13888, 72.92666, '2016-07-21T05:55:09.000Z']
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
    [],
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

var segmentTest = [
    [19.04076, 73.00895, '2017-01-16T05:29:42+00:00'],
    [19.04049, 73.00895, '2017-01-16T05:31:04+00:00'],
    [19.04107, 73.00896, '2017-01-16T06:09:28+00:00'],
    [19.04099, 73.00969, '2017-01-16T06:12:16+00:00'],
    [19.0415, 73.00972, '2017-01-16T06:13:51+00:00'],
    [19.04185, 73.00974, '2017-01-16T06:13:56+00:00'],
    [19.1038, 72.89738, '2017-01-16T07:50:54+00:00'],
    [19.10445, 72.89765, '2017-01-16T07:54:04+00:00'],
    [19.1038, 72.89738, '2017-01-16T07:56:04+00:00']
];

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
            pointsToSplit, '2016-07-21T05:55:09.000Z'
        ).should.deep.equal(
            [
                {'path': [[19.13626, 72.92506]], 'bearing': 0, 'style': 'solid'},
                {'path': [[19.13626, 72.92506], [19.13777, 72.92555]], 'bearing': 17.04, 'style': 'dotted'},
                {'path': [[19.13777, 72.92555], [19.13888, 72.92666]], 'bearing': 43.37, 'style': 'solid'}
            ]
        );

        getPolylineSegments(
            pointsToSplit, '2016-07-21T05:43:09.000Z'
        ).should.deep.equal(
            [
                {'path': [[19.13626, 72.92506]], 'bearing': 0, 'style': 'solid'}
            ]
        );

        getPolylineSegments(
            segmentTest, '2017-01-16T07:56:04+00:00'
        ).should.deep.equal(
            [
                {'path': [[19.04076, 73.00895], [19.04049, 73.00895]], 'bearing': 180, 'style': 'solid'},
                {'path': [[19.04049, 73.00895], [19.04107, 73.00896]], 'bearing': 0.93, 'style': 'dotted'},
                {'path': [[19.04107, 73.00896], [19.04099, 73.00969], [19.0415, 73.00972], [19.04185, 73.00974]], 'bearing': 3.09, 'style': 'solid'},
                {'path': [[19.04185, 73.00974], [19.1038, 72.89738]], 'bearing': -59.72, 'style': 'dotted'},
                {'path': [[19.1038, 72.89738], [19.10445, 72.89765], [19.1038, 72.89738]], 'bearing': -158.57, 'style': 'solid'}
            ]
        );
    });
});

describe('#encoder', function() {
    it('encodes polyline', function() {
        encoder(points).should.equal(encoded);
    });
});
