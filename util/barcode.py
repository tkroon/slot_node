from SimpleCV import Color,Camera
import requests
import os

url = 'http://127.0.0.1:3000/api/bet/'
cam = Camera()  #starts the camera
currentResult = 'none'

while(1==1):
  img = cam.getImage() #gets image from the camera
  barcode = img.findBarcode() #finds barcode data from image
  if(barcode is not None): #if there is some data processed
    #os.system('espeak -ven+f3 "Card Scanned"')
    barcode = barcode[0] 
    result = str(barcode.data)
    barcode = [] #reset barcode data to empty set
    if (result != currentResult):
      currentResult = result
      try:
        r=requests.get(url+result)
        print result + ' status: ' + str(r.status_code) + ' ' + r.text #r.json().userId #prints result of barcode in python shell
      except:
        pass
    