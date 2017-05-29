#!/usr/bin/env python
import optparse
import os

def main():
  p = optparse.OptionParser()
  p.add_option('--talk', '-t', action="store", default="Hello")
  p.add_option('--speed', '-s', default="90")
  p.add_option('--voice', '-v', default="m3")
  options, arguments = p.parse_args()
  os.system('espeak -ven+' + options.voice + ' -s ' + options.speed + ' ' + options.talk )

if __name__ == '__main__':
  main()