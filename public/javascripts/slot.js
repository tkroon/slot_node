/**
/**
* Slot machine
* Author: Saurabh Odhyan | http://odhyan.com
*
* Licensed under the Creative Commons Attribution-ShareAlike License, Version 3.0 (the "License")
* You may obtain a copy of the License at
* http://creativecommons.org/licenses/by-sa/3.0/
*
* Date: May 23, 2011
*/
function beep() {
    var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

function click() {
    var snd = new  Audio("data:audio/wav;base64,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");
    snd.play();
}

function hideCalc(message) {
    //alert("blah: " + message);
    $('.infoarea').css({'background-image':'url("../images/slotplay.gif")'});
    $('#leftinfo').hide();
    if (message == undefined) message = '&nbsp;';
    $('#result').html(message);
    window.clearInterval(calcTimer);
};
    
function showCalc() {
    window.clearInterval(calcTimer);
    $('.infoarea').css({'background-image':'none'});
    $('#leftinfo').show();
};
    
function promo(sound,action) {
    $('#result').html('&nbsp;');
    $.ajax({
        url: '/api/sound/' + sound + "/" + action,
        type: 'GET',
        data: "",
        success: function(data) {
        }
    });
}

$(document).ready(function() {
    /**
    * Global variables
    */
    var completed = 0,
        imgHeight = 1187, //5700
        GREENDOLLAR = 'dollar';
        calcTimer = null; //holds setInterval of the calc hide/show 
        calcInterval = 30000;
        minBet = 5;
        bet = 0;
        posArr = [
            0, //orange 0
            298, //bell 1425
            595, //bar 2850
            895 //seven 4275
        ];
    
    var win = [];
    win[0] = 'logo';
    win[298] = 'panther';
    win[595] = 'paw';
    win[895] = 'dollar';

    /**
    * @class Slot
    * @constructor
    */
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot 
        this.pic = win[0]; // the picture that is showing  
        this.speedInterval = 0; // number of intervals since last beep

        $(el).pan({
            fps:20,
            dir:'down'
        });
        $(el).spStop();
    }

    /**
    * @method start
    * Starts a slot
    */
    Slot.prototype.start = function() {
        var _this = this;
        showCalc();
        //$(_this.el).addClass('motion');
        this.maxSpeed = (Math.random() * 80) + 30;
        this.step = (Math.random()) * 3 + 1;
        $(_this.el).spStart();
        clearInterval(_this.si);
        beep();
        _this.si = window.setInterval(function() {
            if(_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
            // calculate speed interval of beep
            _this.speedInterval += _this.speed;
            if(_this.speedInterval > 300) {
                beep();
                _this.speedInterval = 0;
            }
        }, 100);
    };

    /**
    * @method stop
    * Stops a slot
    */
    Slot.prototype.stop = function() {
        var _this = this,
            limit = 30;
        clearInterval(_this.si);
        _this.si = window.setInterval(function() {
            if(_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
                _this.speedInterval += _this.speed;
                if(_this.speedInterval > 250) {
                    beep();
                    _this.speedInterval = 0;
                }
            }
            if(_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                //$(_this.el).removeClass('motion');
                _this.speed = 0;
                click();
            }
        }, 100);
    };

    /**
    * @method finalPos
    * Finds the final position of the slot
    */
    Slot.prototype.finalPos = function() {
        var el = this.el,
            el_id,
            pos,
            posMin = 2000000000,
            best,
            bgPos,
            i,
            j,
            k;

        el_id = $(el).attr('id');
        //pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(' ')[1];
        pos = parseInt(pos, 10);

       // rootPos = pos % 4;
        //for(i = 0; i < posArr.length; i++) {
        //    if(rootPos)
       // }

        for(i = 0; i < posArr.length; i++) {
            for(j = 0;;j++) {
                k = posArr[i] + (imgHeight * j);
                if(k > pos) {
                    if((k - pos) < posMin) {
                        posMin = k - pos;
                        best = posArr[i];
                        this.pos = posArr[i]; //update the final position of the slot
                        this.pic = win[this.pos];
                        // this updates the spritely last position value so rollers won't jump at the start
                        $._spritely.instances[el_id]['t'] = this.pos; 
                    }
                    break;
                }
            }
        }

        best += imgHeight;
        bgPos = "0 " + best + "px";
        $(el).animate({
            backgroundPosition:"(" + bgPos + ")"
        }, {
            duration: 200,
            complete: function() {
                completed ++;
            }
        });
    };

    /**
    * @method reset
    * Reset a slot to initial state
    */
    Slot.prototype.reset = function() {
        var el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        $(this.el).css('background-position', '0px 4px');
        this.speed = 0;
        completed = 0;
        $('#result').html('');
    };

    function enableControl() {
        $('#control').attr("disabled", false);
    }

    function disableControl() {
        $('#control').attr("disabled", true);
    }

    function printResult() {
        var pay;
        if (bet === 0) bet = minBet;
        /*********************
         *   No match     * 0
         *   one $        * 2
         *   two match    * 10 $ pays double
         *   three match  * 100
         *   three $      * 1000
         *********************/ 
        if (a.pic === b.pic && a.pic === c.pic) {
            match = 3;
            type = a.pic;
        } else {
            match = 2;
            if (a.pic === b.pic || a.pic === c.pic) {
                type = a.pic;
            } else if (b.pic === c.pic) {
                type = b.pic;
            } else {
                match = 1;
                type = 'none';
            }
        }
        if((a.pic + b.pic + c.pic).includes(GREENDOLLAR)) type = GREENDOLLAR;
        pay = 0;

        switch (match) {
        case 1:
            //if(type === GREENDOLLAR) pay = 1; // removed greendollar effect
            break
        case 2:
            pay = 10;
            break;
        case 3:
            pay = 100;
            if(type === GREENDOLLAR) pay = 500;
            break;
        } 
        //if (type === GREENDOLLAR) pay = pay * 2; // removes green dollar double
       
        // 'logo';
        // 'panther';
        // 'paw';
        // 'dollar';

        $.ajax({
            url: '/api/pay/' + pay,
            type: 'PUT',
            data: "",
            success: function(data) {
                var res = data.split("|");
                $('#bet').text(res[1]);
                $('#total').text(res[2]);
		        $('#user').text(res[3]);
                $('#result').html(res[4]);
                // extra values        
                $('#thisbet').text(res[1]);
                $('#grandtotal').text(res[2]);
                $('#lastCash').text(res[5]);
                $('#winloose').text(res[6]);
            }
        });
        calcTimer = window.setInterval(function(){ hideCalc('<div class="alert">Cash-out at bank when done</div>'); }, calcInterval);
        bet = 0; // reset to zero bet
    }

    //create slot objects
    var a = new Slot('#slot1', 30, 1),
        b = new Slot('#slot2', 45, 2),
        c = new Slot('#slot3', 70, 3);

    /**
    * Slot machine controller
    */
    $('#control').click(function() {
        disableControl(); //disable control until the slots reach max speed
        var speedup;
        var slowdown;
        a.start();
        b.start();
        c.start();
        //check every 100ms if slots have reached max speed 
        //if so, enable the control
        speedup = window.setInterval(function() {
            if(a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
                window.clearInterval(speedup);
                a.stop();
                b.stop();
                c.stop();
                slowdown = window.setInterval(function() {
                    if(a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
                        window.clearInterval(slowdown);
                        enableControl();
                        printResult();
                        completed = 0;
                    }
                }, 100);
            }
        }, 100);
    }); 
});
