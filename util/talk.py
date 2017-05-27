#!/usr/bin/env python
import optparse
import os

def main():
  p = optparse.OptionParser()
  p.add_option('--speak', '-s', action="store", default="Hello")
  p.add_option('--voice', '-v', default="m3")
  options, arguments = p.parse_args()
  os.system('espeak -ven+' + options.voice + ' ' + options.speak)

if __name__ == '__main__':
  main()