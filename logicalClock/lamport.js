class Lamport{
    constructor (){
        this.timestamp = 0;
    }

    tick(){
        this.timestamp += 1;
    }

    tack(oddTimestamp){
        if(oddTimestamp > this.timestamp){
            this.timestamp = parseInt(oddTimestamp);
        }
        this.tick();
    }
}


export default Lamport;