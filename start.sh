cd /home/pi/slot_node
sudo modprobe snd_bcm2835
sudo aplay ./public/sounds/beep-07.wav
sudo pkill uv4l
sudo pkill mplayer
uv4l --driver raspicam --auto-video_nr --encoding yuv420 --width 320 --height 240 --nopreview
python ./util/barcode.py &
sudo nohup npm start &
sleep 15
