class TimerFreeTokenBucket {
    constructor(fillPerSecond, capacity) {
        this.capacity = capacity
        this.tokens = capacity
        this.fillPerSecond = fillPerSecond
        this.lastUpdated  = Date.now() / 1000 //Divide by 1000 for milisecond to second conversion
    }

    useToken() {
        this.refill()

        if(this.tokens > 0) {
            this.tokens -=1
            return true
        }
        return false
    }

    refill () {
        let currentTime = Date.now() / 1000         //Divide by 1000 for second to millisecond conversion
        let timeElapsedSinceLastUpdated = currentTime - this.lastUpdated
        this.tokens += Math.min(this.capacity , this.tokens + timeElapsedSinceLastUpdated * this.fillPerSecond/1000)  
        //Minimum because we don't want to exceed capacity. Ex: 2(current)+3(token based on elapsed time) = 5 > 4(token capacity), Hence Cap to 4 tokens
    }
}