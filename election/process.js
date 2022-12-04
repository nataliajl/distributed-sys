import schedule from 'node-schedule';
import fetch from "node-fetch";
import logger from '../log.js';

// 1 - O processo deve conhecer todos os outros processos
// 2 - Se nenhum dos processos acima responder o chamado de eleição, 
// então ele será o novo coordenador
// 3 - Se o processo receber um chamado de eleição, ele deverá responder
// quem o chamou
// 4 - Ao responder quem o chamou, ele também deverá continuar o processo
// de requisitar os processos acima
// 5 - O vencedor enviará a todos os processos uma mensagem dizendo que 
// ele é o novo coordenador. 

class Process {
    constructor(id, url, processes){
        this.id = id;
        this.url = url;
        this.processes = processes;
        this.isCoordinator = false;
        this.coordinator = this.processes.find(process => process.isCoordinator == true);
    }

    /**
     * @param {int} id
     */
    setCoordinator(id){
        const process = this.processes.find(process => process.id == id)
        this.coordinator = process;
        if(process.id != this.id){
            this.isCoordinator = false;
        }
    }

    updateProcesses(){
        this.processes = this.processes.map((process) => {
            fetch(`${process}/info`, {method: 'GET'})
            .then((response) => response.json())
            .map((process) => {
                return {
                    id: process.id,
                    url: process.url,

                }
            })
            ;
        })
    }

    async worker(){
        schedule.scheduleJob(
            '*/5 * * * * *',
            async function () {
                if(!this.isCoordinator)
                    pingCoordinator();
                updateProcesses();
            }
        );
    }

    declareMyselfAsCoordinator(){
        this.isCoordinator = true;
        logger.info("I'm the coordinator now!");
        
        this.processes.forEach((process) => {
            fetch(`${process.url}/news`, {method: 'POST', body: JSON.stringify({id: this.id})})
            .then((response) => response.json())
            .then((data) => logger.info(data))
            .catch((err)=> logger.error(err));
        });

    }

    async callElection(){
        logger.info("Election called");
        new Promise((resolve, reject) => {
            this.processes.forEach(process => {
                if(process.id > this.id){
                    fetch(`${process.url}/election`, {method: 'GET'})
                    .then((response) => {
                        const status = response.status;
                        logger.info(`Process ${process.id} response: ${status}`);
                        if(status == 200){
                            reject(false); // not elected if receive response
                        }
                    })
                }
            });
            resolve(true);
        }).then((response) => {
            if(response == true){
                this.declareMyselfAsCoordinator();
            }
        });
    }

    async knowTheNewestCoordinator(coordinatorId){
        logger.info(`Okay, i accept ${coordinatorId} as my coordinator because it is stronger than me`)
        this.currentCoordinator = coordinatorId
    }

    async pingCoordinator(){
        logger.info(`The process ${this.id} is verifying the coordinator availability`);
        const responseStatus = fetch(`${this.coordinator.url}/ping`, {method: 'GET'})
        .then((response) => response.status);
        if(responseStatus !== 200){
            this.callElection();
        }
    }

}

export default Process;