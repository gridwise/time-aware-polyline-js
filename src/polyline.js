'use strict';

/**
 *
 * @module polyline
 */

var polyline = {};

// Code goes here

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

/**
 *
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

module.exports = polyline
