## How to use
## Methods

### .setRgb (myColour, callback)
Immediately sets desired colour, with optional callback function.

### .fadeRgb (myColour, time, callback)
Fades to desired colour linearly, over `time` ms. Optional callback.

### .pulseRgb (startColour, endColour, fadeTime, pulseTime)
First, fades to `startColour` over `fadeTime` ms as with `.fadeRgb`, but then fades back and forth between this initial colour and `endColour`. In this case, pulseTime is the time in ms fading from one colour to the next, e.g. the total period is 2*`pulseTime`.

### .endPulse()
Stops the pulse effect.

### .strobeRgb(colour, pulselength, duration, callback)
Creates a stroboscope effect where the output is either switched off, or set to `colour`. This switch happens every `pulselength`ms, for a total duration of `duration`ms. Optional callback.

### .close()
Shuts down the PWM channel.