import RPi.GPIO as GPIO
import time
import os 

REDPIN = 5
GREENPIN = 26
BLUEPIN = 19
 
FADESPEED = .1     # make this higher to slow down
 
GPIO.setwarnings(False)
# Set the layout for the pin declaration
GPIO.setmode(GPIO.BCM)
GPIO.setup(REDPIN, GPIO.OUT)
GPIO.setup(GREENPIN, GPIO.OUT)
GPIO.setup(BLUEPIN, GPIO.OUT)

red = GPIO.PWM(REDPIN,50)
blue = GPIO.PWM(BLUEPIN,50)
green = GPIO.PWM(GREENPIN,50)

red.start(0)
blue.start(0)
green.start(0)

#while False:
  #green.ChangeDutyCycle(100)
  #time.sleep(1)
  #green.ChangeDutyCycle(25)
  #time.sleep(1)

#os._exit(1)

print "fade from blue to violet"
for r in range(0, 101):
  red.ChangeDutyCycle(r)
  time.sleep(FADESPEED)

print "fade from violet to red"
for b in range(100, -1):
  blue.ChangeDutyCycle(b)
  time.sleep(FADESPEED)

print "fade from red to yellow"
for g in range(0, 101):
  green.ChangeDutyCycle(g)
  time.sleep(FADESPEED)

print "fade from yellow to green"
for r in range(100, -1):
  red.ChangeDutyCycle(r)
  time.sleep(FADESPEED)

print "fade from green to teal"
for b in range(0, 101):
  blue.ChangeDutyCycle(b)
  time.sleep(FADESPEED)

print "fade from teal to blue"
for g in range(100, -1):
  green.ChangeDutyCycle(g)
  time.sleep(FADESPEED)

red.stop(0)
green.stop(0)
blue.stop(0)
GPIO.cleanup()