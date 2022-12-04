import fetch from "node-fetch";
import schedule from 'node-schedule';

class Token{
    constructor (){
        this.isAvailable = false;
    }

    receiveToken(){
        this.isAvailable = true;
        console.log("I have got the token!");
    }

    tryToPassToken(address){
        schedule.scheduleJob(
            '*/1 * * * * *',
            async function () {
                if(this.isAvailable){
                    fetch(address +'/receive-token', {method: 'post'})
                                    .then(function (response){
                                      return response;
                                    })
                                    .catch(function (err){
                                      console.error(err);
                                    });
                    this.isAvailable = false;
                    console.log('It is not with me anymore!');
                }
                console.log("Still using token...");     
            }
        );
    }
}


export default Token;