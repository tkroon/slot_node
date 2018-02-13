var util = require('./util.js');

var RgbChannel = require('rpi-rgb').Channel;
var Colour = require('rpi-rgb').Colour;
var stripled = new RgbChannel(2,5,4);
var fs = require('fs');
happyseq = require('../public/ledseq/happyseq.json');
championseq = require('../public/ledseq/championseq.json');
celebrateseq = require('../public/ledseq/celebrateseq.json');

color = function(red,green,blue) {
  return new Colour(100-red,100-green,100-blue);
}

setBrightness = function(setColor,bright){
  try {
    if(allcolors[setColor] != undefined) {
      var percent = parseInt(bright)/100;
      var colorObj = allcolors[setColor];
      var red = Math.floor((100-colorObj.red) * percent);
      var green = Math.floor((100-colorObj.green) * percent);
      var blue = Math.floor((100-colorObj.blue) * percent);
      var newColor = color(red,green,blue)
      //console.log("red: " + red + " green: " + green + " blue: " + blue);
      return newColor;
    }
  } catch (err) { 
    //console.log("setBrightness Error: " + err);
  }
  return black;
}

var red = color(100,0,0);
var green = color(0,100,0);
var blue = color(0,0,100);
var white = color(100,100,100);
var yellow = color(100,100,0);
var black = color(0,0,0);
var violet = color(58,0,83);
var indigo = color(29,0,51);
var orange = color(100,50,0);
var rainbow = [white,violet,indigo,blue,green,yellow,orange,red,black];
var rainbow_names = ["white","violet","indigo","blue","green","yellow","orange","red","black"];
var allcolors = {
  "violet": violet,"indigo":indigo,"blue":blue,
  "green":green,"yellow":yellow,"orange":orange,
  "red":red,"black":black,"white":white,"off":black
}; 

// initialize to off aka black
stripled.setRgb(black);

exports.setRgb= function (color) {
  stripled.setRgb(allcolors[color]);
}

exports.setTo= function (color,bright,wait) {
  var newColor = setBrightness(color,bright)
  if (wait != undefined) util.wait(wait);
  stripled.setRgb(newColor);
}

exports.fadeTo = function (color,bright,time) {
  var newColor = setBrightness(color,bright)
  stripled.fadeRgb(newColor,time)
}

exports.fadeOut = function(time) {
  stripled.fadeRgb(black,time)
}

exports.off = function() {
  stripled.setRgb(black);
}

exports.rainbow = function() {
    for(i=0; i < rainbow.length; i++) {
    stripled.setRgb(rainbow[i]);
    console.log(rainbow_names[i]);
    util.wait(3000);
  }
}

exports.startRandomFade = function() {
  clearTimeout(timer);
  led.fadeTo("black", 100, 1000);
  var i = Math.round(Math.random() * 9);
  var time = Math.round(Math.random() * 1000) + 500;
  var bright = Math.round(Math.round(Math.random() * 100));  
  //console.log("color: " + rainbow_names[i] + "vxi: " + i + " time: " + time + " bright: " + bright);
  led.fadeTo(rainbow_names[i],bright,time);
  timer = setTimeout(function(){ led.startRandomFade(); }, time);
}

exports.playLedSequence = function(index,sequence) {
  clearTimeout(seqTimer);
  var time = 0;
  var frame = sequence[index++];
  if (frame != null) {
    //console.log("This Frame: " + frame.action + " " + frame.color + " " + frame.bright + " " + frame.time);
    switch(frame.action) {
      case "fade":
        led.fadeTo(frame.color, frame.bright, frame.time);
        time = frame.time
        break;
      case "on":
        led.setTo(frame.color, 100);
        break;
      case "off":
        led.setTo(frame.color, 0);
        break;
      case "set":
        led.setTo(frame.color, frame.bright);
        break;
      case "wait":
        time = frame.time;
        break;
      default:
        break;
    }
    seqTimer = setTimeout(function(){ led.playLedSequence(index, sequence); }, time);
  }   
}

exports.stopRandomFade = function(timer) {
  clearTimeout(timer);
}