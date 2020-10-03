class Task{
    #_title; // The Task title
    #_timer; // The timer

    constructor(title="", second=0, minute=0) {
        this.#_title = title;
        this.#_timer = new Timer(second, minute);
    }

    get timer(){
        return this.#_timer;
    }

    get title(){
        return this.#_title;
    }

    get sub_task(){
        return {
            "title": this.title,
            "minute": this.timer.minute,
            "second": this.timer.second,
            "secondRemain": this.timer.secondRemain,
        }
    }

    set title(value){
        typeof value === "string" ? this.#_title = value : undefined;
    }
}