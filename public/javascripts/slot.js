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
$(document).ready(function() {
    /**
    * Global variables
    */
    var completed = 0,
        imgHeight = 1187, //5700
        GREENDOLLAR = 'dollar';
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
        //$(_this.el).addClass('motion');
        this.maxSpeed = (Math.random() * 80) + 30;
        this.step = (Math.random()) * 3 + 1;
        $(_this.el).spStart();
        clearInterval(_this.si);
        _this.si = window.setInterval(function() {
            if(_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
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
            }
            if(_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                //$(_this.el).removeClass('motion');
                _this.speed = 0;
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
         *   two match    * 10 
         *   three match  * 100
         *   three $      * 1000
         *   Dollar Doubles All payouts
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
            if(type === GREENDOLLAR)
                pay = 1;
            break;
        case 2:
            pay = 10;
            break;
        case 3:
            switch (type) {
                case GREENDOLLAR:
                    pay = 500;
                    break;
                default:
                    pay = 100;
            }
        } 
        if (type == GREENDOLLAR) pay = pay * 2;
       
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
		        $('#result').html(res[3]); 
            }
        });
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
