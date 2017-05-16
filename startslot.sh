sudo modprobe snd_bcm2835
sudo aplay /usr/share/sounds/alsa/Front_Center.wav
cd slot_node
sudo pkill uv4l
uv4l --driver raspicam --auto-video_nr --encoding yuv420 --width 320 --height 240 --nopreview
python ./tests/barcode.py &
sudo npm start &
