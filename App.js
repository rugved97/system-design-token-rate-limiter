const express = require("express")
let app  = express()

class TokenBucket {

    constructor(refillRate, capacity) {
        console.log('kya be')
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


function limitRequests (refillRate, maxBurst) {
    const bucket = new TokenBucket(refillRate,maxBurst) 

    return function limitRequestsMiddleWare(req, res, next) {
        if(bucket.useToken()) {
            next()
        } else {
            res.status(429).send('Rate Limit exceeded')
        }
    }

}

function limitRequestByIp(refillRate, maxBurst) {
    const ipBuckets = new Map()
    

    return function limitRequestByIpMiddleWare(req,res,next) {
        console.log(ipBuckets)
        if(!ipBuckets.has(req.ip)) {
            ipBuckets.set(req.ip, new TokenBucket(refillRate, maxBurst))
        } 
        let currentIp = ipBuckets.get(req.ip)

        if(currentIp.useToken()) {
            next()
        }   else {
            res.status(429).send('Client Limit exceeded for ip', currentIp)
        }
    }
}

app.get('/' , limitRequests(1000, 4), (req, res, next) => {        //Refill every 1000ms, capacity of 4
    console.log('Middle-ware inside middleware [Middle-MIDDLE-ware');
    // res.send('Trapped here sucker'); // Return Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client.
    next()
} ,
function() {
    console.log('ONLY ONCE CALLED ON SETUP');
    return function (req, res, next) {
        next()
    }
}(), //'ONLY ONCE CALLED ON SETUP', because function(){}"()" --->called
limitRequestByIp(1000, 4),
(req,res) => { 
    res.send('Hello from rate limiter')
})

app.listen(3000, () => console.log('Server Running'))