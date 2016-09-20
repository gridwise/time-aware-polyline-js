'use strict';

/**
 * Methods for encoding and decoding time aware polylines
 *
 * @module polyline
 */

var polyline = {};


/**
 * Encodes a time aware polyline
 */
polyline.encodeTimeAwarePolyline = function(points) {
  return extendTimeAwarePolyline("", points, null);
}

/**
 * Decodes a time aware polyline
 */
polyline.decodeTimeAwarePolyline = function(polyline) {
  // Method to decode a time aware polyline and return gpx logs
  var gpxLogs = [];
  var index = 0;
  var lat = 0;
  var lng = 0;
  var timeStamp = 0;
  var polylineLine = polyline.length;
  
  while (index < polylineLine) {
    // Decoding dimensions one by one
    var latResult = getDecodedDimensionFromPolyline(polyline, index);
    index = latResult[0];
    var lngResult = getDecodedDimensionFromPolyline(polyline, index);
    index = lngResult[0];
    var timeResult = getDecodedDimensionFromPolyline(polyline, index);
    index = timeResult[0];
    
    // Resultant variables
    lat += latResult[1];
    lng += lngResult[1];
    timeStamp += timeResult[1];
    gpxLogs.push(getGpxLog(lat, lng, timeStamp));
  }
  
  return gpxLogs;
}

/**
 * Decodes a time aware polyline to get locations at given timestamps
 */
polyline.getLocationsAtTimestamps = function(timeAwarePolyline, timeStamps) {
  var decoded = polyline.decodeTimeAwarePolyline(timeAwarePolyline);
  var index = 0, locations = [];

  for (index = 0; index < timeStamps.length; index++) {
    var locationsFound = getLocationsTillTimeStamp(decoded, timeStamps[index]);
    locations.push(locationsFound[locationsFound.length - 1]);
  }

  return locations;
}

/**
 * Decodes a time aware polyline to get locations traveled till a timestamp
 * to build a live polyline
 */
polyline.getLocationsElapsedByTimestamp = function(decodedTimeAwarePolyline, timeStamp) {
  return getLocationsTillTimeStamp(decodedTimeAwarePolyline, timeStamp);
}

// Helper methods

function extendTimeAwarePolyline(polyline, points, lastPoint) {
  var lastLat = 0, lastLng = 0, lastTimeStamp = 0;

  if (polyline == null) {
    polyline = '';
  }

  if (lastPoint != null) {
    lastLat = getLat(lastPoint);
    lastLng = getLng(lastPoint);
    lastTimeStamp = getTimeStamp(lastPoint);
  }

  if (points.length < 1) {
    return polyline
  }

  for (var i = 0; i < points.length; i++) {
    var currentGpxLog = points[i];
    var lat = getLat(currentGpxLog);
    var lng = getLng(currentGpxLog);
    var timeStamp = getTimeStamp(currentGpxLog);

    var diffArray = [lat - lastLat, lng - lastLng, timeStamp - lastTimeStamp];

    for (var j = 0; j < diffArray.length; j++) {
      var currentDiff = diffArray[j];
      currentDiff = (currentDiff < 0) ? notOperator(lshiftOperator(currentDiff, 1)) : lshiftOperator(currentDiff, 1);

      while (currentDiff >= 0x20) {
        polyline += String.fromCharCode((0x20 | (currentDiff & 0x1f)) + 63);
        currentDiff = rshiftOperator(currentDiff, 5);
      }

      polyline += String.fromCharCode(currentDiff + 63);
    }

    lastLat = lat, lastLng = lng, lastTimeStamp = timeStamp;
  }

  return polyline;
}

function getDecodedDimensionFromPolyline(polyline, index) {
  // Method to decode one dimension of the polyline
  var result = 1;
  var shift = 0;

  while (true) {
    var polylineChar = polyline[index];
    var b = polylineChar.charCodeAt(0) - 63 - 1;
    index ++;
    result += lshiftOperator(b, shift);
    shift += 5;

    if (b < 0x1f) {
      break;
    }
  }

  if ((result % 2) !== 0) {
    return [index, rshiftOperator(notOperator(result), 1)];
  } else {
    return [index, rshiftOperator(result, 1)];
  }
}

function getLocationsTillTimeStamp(decodedPolyline, timeStamp) {
  var decoded = decodedPolyline;
  // decoded and timeStamps are both in order of times

  var index = 0;
  var currentPair = [];
  var locationsElapsed = [];

  // remove times before first time
  var timeStampToFind = timeStamp,
      startTime = decoded[0][2];
  while (timeStampToFind <= startTime) {
    return [[decoded[0][0], decoded[0][1]]];
  }

  for (index = 0; index < decoded.length; index++) {
    currentPair.push(decoded[index]);
    locationsElapsed.push([decoded[index][0],
                           decoded[index][1]]);

    if (currentPair.length == 2) {
      var timeStampToFind = timeStamp;

      var startTime = currentPair[0][2],
          endTime = currentPair[1][2];

      if (timeStampToFind >= startTime && timeStampToFind <= endTime) {
        // location is in the current pair
        var midLocation = getLocationInPair(currentPair, timeStampToFind);
        var endLocation = [currentPair[1][0], currentPair[1][1]];

        if (midLocation[0] != endLocation[0] || midLocation[1] != endLocation[1]) {
          // only if the new mid point location is different from end location
          // add it, because end location has been added
          locationsElapsed.push(midLocation);
        }

        return locationsElapsed;

        // it is possible that the next timestamp is also in the
        // same pair, hence redo-ing same iteration
        currentPair.pop();
        index --;
      } else {
        currentPair.shift();
      }
    }
  }

  return [[decoded[index-1][0], decoded[index-1][1]]];
}

function getLocationInPair(gpxPair, timeStamp) {
  // timeStamp lies between the timeStamps in the gpx logs
  var startLat = gpxPair[0][0],
      startLng = gpxPair[0][1],
      endLat = gpxPair[1][0],
      endLng = gpxPair[1][1],
      startTime = new Date(gpxPair[0][2]),
      endTime = new Date(gpxPair[1][2]),
      currentTime = new Date(timeStamp);
  var ratio = (startTime - currentTime) / (startTime - endTime);
  return [startLat * (1 - ratio) + endLat * ratio,
          startLng * (1 - ratio) + endLng * ratio];
}

// Methods to convert types

function getCoordinate(intRepresentation) {
  var coordinate = intRepresentation * 0.00001;
  return +coordinate.toFixed(5);
}

function getIsoTime(timeStamp) {
  // timeStamp is in seconds
  return new Date(timeStamp * 1000).toISOString();
}

function getGpxLog(lat, lng, timeStamp) {
  return [
    getCoordinate(lat), getCoordinate(lng), getIsoTime(timeStamp)
  ];
}

function getLat(gpxLog) {
  return Math.round(gpxLog[0] * 100000);
}

function getLng(gpxLog) {
  return Math.round(gpxLog[1] * 100000);
}

function getTimeStamp(gpxLog) {
  return +new Date(gpxLog[2]) / 1000;

}

// Override bit wise operators to circumvent 64 bit int issue

function lshiftOperator(num, bits) {
  // Custom left shift for 64 bit integers
  return num * Math.pow(2, bits);
}

function rshiftOperator(num, bits) {
  // Custom right shift for 64 bit integers
  return Math.floor(num / Math.pow(2, bits));
}

function notOperator(num) {
  // Custom not operator for 64 bit integers
  return ~num;
}


module.exports = polyline
