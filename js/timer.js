/*
 * Organization: UniSA
 * Subject Tool For Software Development
 * Group: Thu11_group02
 * Author: choty036@mymail.unisa.edu.au
 * Created Date: 16/08/2020
 */

/*
* The core functions of the Timer class are start() and stop().
* Once a timer object call start(), the timer object start count down.
* on the contrary, calling stop() stop the timer counting down.
*
*  The public fields
* @param {number} minute Allow to get or set. The minute remain.
* @param {number} second Allow to get or set. The second remain. Beware this field is not total second, it doesn't contain the minute with it.
* @param {number} totalSecond Allow to get ONLY The total second. Basically this field combine the second and minute fields.
* @param {number} secondRemain Allow to get ONLY. The remaining second of timer
* @param {number}  isStart Allow to get ONLY. It's the status of the timer
*/
class Timer {
    #_minute; // The original minute of the timer
    #_second; // The original second of the timer. Be careful it's not the total second of the timer
    #_secondRemain; // The total second left of the timer
    #_start; // Timer status
    #_interval // The setInterval() that time the total second

    constructor(second = 0, minute = 0, start = false) {
        this.second = second;
        this.minute = minute;
        this.start = start;
        this.secondRemain = this.second + this.minute * 60;

        if (this.#_start) {
            this.start(); // Start timer
        }
    }

    get second() {
        return this.#_second;
    }

    /* Warning: Changing second will cause secondRemain reset with given value */
    set second(value) {
        value = Timer.cleanInteger(value);
        this.#_secondRemain = value + this.#_minute * 60; // Update total second
        this.#_second = value;
    }

    get minute() {
        return this.#_minute;
    }

    /* Warning: Changing minute will cause secondRemain reset with given value */
    set minute(value) {
        value = Timer.cleanInteger(value)
        this.#_secondRemain = this.#_second + value * 60; // Update total second
        this.#_minute = value;
    }

    get totalSecond() {
        return this.#_second + this.#_minute
    }

    set secondRemain(value) {
        value = Timer.cleanInteger(value);
        this.#_secondRemain = value;
    }

    get secondRemain() {
        return this.#_secondRemain;
    }

    get isStart() {
        return this.#_start;
    }

    /*
     * This function converts a number to integer and return a integer
     *
     *  @param {number} number Any number type parameter
     *  @return {number} integer
     */
    static cleanInteger(number = 0) {
        let num = parseInt(number)

        if (isNaN(num) || number < 0) {
            return 0;
        }

        return num;
    }

    /*
        * This function converts minute to second and return second
        *  @param {number} minute
        *  @return {number}
        */
    static minuteToSecond(minute = 0) {
        minute = cleanInteger(minute);

        return Math.floor(minute * 60);
    }

    /*
        * This function converts second to minute and return minute
        *
        *  @param {number} seccond
        *  @return {number}
        */
    static secondToMinute(second = 0) {
        second = cleanInteger(second);

        return Math.floor(second / 60);
    }

    /*
        * This function call a setInterval to start timer, and change
        *  timer start field. The setInerval will stop the timer object
        *  once the totalSecond of the timer object reach to 0.
        *
        *  @param {number} obj Timer object
        */
    #startTimer() {
        // Return if timer already started
        if (this.#_start) return;

        console.log("Start timer");
        this.#_start = true; // Update timer status

        let obj = this;
        this.#_interval = setInterval(function () {
            obj.secondRemain -= 1;
            console.log("Current Total Second Left: " + obj.secondRemain);

            if (obj.secondRemain <= 0) {
                obj.stop();
            }
        }, 1000)
    }

    /*
        * This function stop timing interval to stop timer,
        * and change timer start field
        *  @param {number} obj Time object
        */
    #stopTimer() {
        if (!this.#_start) return; // Return if timer not yet start

        console.log("Stop timer");
        this.#_start = false; // Update timer status
        clearInterval(this.#_interval); // Stop the interval that counting the second
    }

    /*
        * This function stop timing interval to stop timer,
        * and change timer start field
        *  @param {number} obj Time object
        */
    #resetTimer() {
        console.log("Reset timer");
        // Trigger setter of timer minute and second will force the totalSecondLeft reset itself with the time
        this.minute = this.#_minute;
        this.second = this.#_second;
    }

    /*
        * This function start timer
        */
    start() {
        this.#startTimer(); // The real implementation start timing
    }

    /*
        * This function stop timer
        */
    stop() {
        this.#stopTimer(); // The real implementation stop timing
    }

    /*
        * This function reset timer
        */
    reset() {
        this.#resetTimer(); // The real implementation stop timing
    }
}
