import fetch from "node-fetch";
import logger from '../log.js';

class Process {
    constructor(name){
        this.name = name;
        this.task = 0;
        this.hasToken = false;
    }

    removeTask(){
        this.task -= 1;
        logger.info(`Process ${this.name} queue: ${this.task}`); 
    }

    addTask(number){
        if (number)
            this.task += parseInt(number);
        else
            this.task += 1;
        
        logger.info(`Process ${this.name} queue: ${this.task}`); 
    }

    setToken(){
        this.hasToken = true;
    }

    async releaseToken(address){
        this.hasToken = false;
        await fetch(`${address}/token`, {method: 'POST'})
        .then((response) => response.json())
        .then((data) => logger.info(data));
    }

    async accessResource(address, miliseconds){
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        while(this.task > 0 && this.hasToken){
            await delay(miliseconds);

            await fetch(`${address}/resource/${this.name}`, {method: 'GET'})
            .then((response) => response.json())
            .then((data) => logger.info(data));

            this.removeTask();
        }
    }
}

export default Process;