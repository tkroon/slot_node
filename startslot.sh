cd slot_node
sudo pkill uv4l
uv4l --driver raspicam --auto-video_nr --encoding yuv420 --width 320 --height 240 --nopreview
python ./tests/barcode.py &
sudo npm start &
