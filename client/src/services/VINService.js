'use strict';

import HttpService from './HttpService';

export default class VINService {
    constructor() {}

    static baseURL() {
        return 'https://vpic.nhtsa.dot.gov/api/vehicles';
    }

    static getAllMakes() {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${this.baseURL()}/GetAllMakes?format=json`,
                function (data) {
                    const makesList = VINService.parseMakesData(data);
                    resolve(makesList);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static getVehicleInfo(vin) {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${this.baseURL()}/decodevinvalues/${vin}?format=json`,
                function (data) {
                    const vehicleInfo = VINService.parseVehicleData(data);
                    resolve(vehicleInfo);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static parseVehicleData(rawData) {
        let vehicle = rawData.Results[0];
        return vehicle;
    }

    static parseMakesData(rawData) {
        let makes = [];
        for (const property in rawData.Results) {
            const field = rawData.Results[property];
            const makeName = field.Make_Name;
            makes.push(makeName);
        }
        return makes;
    }
}
