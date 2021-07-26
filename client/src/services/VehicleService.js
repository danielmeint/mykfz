'use strict';

import HttpService from './HttpService';

export default class VehicleService {
    constructor() {}

    static baseURL() {
        return `http://${location.hostname}:3000/vehicles`;
    }

    static getVehicles() {
        return new Promise((resolve, reject) => {
            HttpService.get(
                this.baseURL(),
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static getVehiclesForUser(user_id) {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${VehicleService.baseURL()}?owner=${user_id}`,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static getVehicle(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${VehicleService.baseURL()}/${id}`,
                function (data) {
                    if (data != undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving vehicle');
                    }
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static deleteVehicle(id) {
        return new Promise((resolve, reject) => {
            HttpService.remove(
                `${VehicleService.baseURL()}/${id}`,
                function (data) {
                    if (data.message != undefined) {
                        resolve(data.message);
                    } else {
                        reject('Error while deleting');
                    }
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static updateVehicle(vehicle) {
        return new Promise((resolve, reject) => {
            HttpService.put(
                `${this.baseURL()}/${vehicle._id}`,
                vehicle,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static createVehicle(vehicle) {
        return new Promise((resolve, reject) => {
            HttpService.post(
                VehicleService.baseURL(),
                vehicle,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static getVehicleProcess(vehicleId, processId) {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${VehicleService.baseURL()}/${vehicleId}/processes/${processId}`,
                function (data) {
                    if (data != undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving process of vehicle');
                    }
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static createProcess(vehicleId, process) {
        return new Promise((resolve, reject) => {
            HttpService.post(
                `${this.baseURL()}/${vehicleId}/processes`,
                process,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }
}
