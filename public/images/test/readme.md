using imagmagik convert to composite images

background.png is white
paw.png is the standin for the users face
slot_tape_facetemplate_2019.png is the transpearant shield tape
slot_tape_2019.png is the standard 2019 

convert -composite -gravity south background.png paw.png comp.png
convert -composite -gravity south comp.png slot_face_tape4.png comp1.png

sysCmd.system("cp slot_tape_2019.png slot_tape.png)
sysCmd.system("convert -composite -gravity south background.png student.png temp.png")

sysCmd.system("convert -composite -gravity south slot_tape_facetmplate_2019.png temp.png slot_tape.png")