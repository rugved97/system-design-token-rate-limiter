class TokenBucket {

    constructor(refillRate, capacity) {
        this.capacity = capacity //Capacity of the bucket
        this.tokens = capacity //token in the bucket
        setInterval(() => this.add(), refillRate)  //Ex: run this.add , every 10 seconds, increment token by 1 ,adding 1 token every 10s
    }

    add() {
        if (this.tokens < this.capacity) {
            this.tokens += 1
        }
    }

    useToken() {
        if(this.tokens > 0) {
            this.tokens -=1 
            return true
        }
        return false
    }

}