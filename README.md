# Time aware polylines in javascript
The google encoded [polyline algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) converts location coordinates into an ascii string. We have extended the algorithm to convert location coordinates with time stamps into ascii strings. The time aware polyline is also available in [python](https://github.com/hypertrack/time-aware-polyline-py).

[![npm version](https://badge.fury.io/js/time-aware-polyline.svg)](https://badge.fury.io/js/time-aware-polyline) [![Build Status](https://travis-ci.org/hypertrack/time-aware-polyline-js.svg?branch=master)](https://travis-ci.org/hypertrack/time-aware-polyline-js) [![Coverage Status](https://coveralls.io/repos/github/hypertrack/time-aware-polyline-js/badge.svg?branch=master)](https://coveralls.io/github/hypertrack/time-aware-polyline-js?branch=master)

Time aware polylines can be used to mark time events on polylines, or run a trip replay, like in the [HyperTrack dashboard](https://dashboard.hypertrack.io/demo).

![Polyline with events](https://bloghypertrack.files.wordpress.com/2016/08/xa95zckcqb.gif?w=760)

## Install
```
$ npm i time-aware-polyline
```

## Encoder
```javascript
var polylineUtil = require('time-aware-polyline');

var points = [
    [19.13626, 72.92506, '2016-07-21T05:43:09+00:00'],
    [19.13597, 72.92495, '2016-07-21T05:43:15+00:00'],
    [19.13553, 72.92469, '2016-07-21T05:43:21+00:00']
]
polylineUtil.encodeTimeAwarePolyline(points);
```

## Decoder

```javascript
var polylineUtil = require('time-aware-polyline');

var polyline = 'spxsBsdb|Lymo`qvAx@TKvAr@K';
polylineUtil.decodeTimeAwarePolyline(polyline);
```

## Testing
To run the tests, you will need to install npm. Use the following command to run the tests.

```
$ npm test
```
