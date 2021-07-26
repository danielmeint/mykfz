'use strict';

const LicensePlateModel = require('../models/licensePlate');
const VehicleModel = require('../models/vehicle');
const UserModel = require('../models/user');

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const digits = '0123456789'.split('');

module.exports = class LicensePlateService {
    constructor() {}

    static generatePlates(areaCode) {
        let result = [];
        for (let i = 0; i < letters.length; i++) {
            const firstLetter = letters[i];
            for (let j = 0; j < letters.length; j++) {
                const secondLetter = letters[j];
                const letterCombination = `${firstLetter}${secondLetter}`;
                for (let number = 1; number <= 2; number++) {
                    const plate = {
                        areaCode: areaCode,
                        letters: letterCombination,
                        digits: number
                    };
                    result.push(plate);
                }
            }
        }
        return result;
    }

    static generatePlatesMatchingPattern(
        areaCode,
        letterPattern,
        digitPattern
    ) {
        let result = [];
        letterPattern = letterPattern.split('');
        const firstLetterOptions =
            letterPattern[0] === '?' ? letters : [letterPattern[0]];

        let secondLetterOptions = [];
        const hasSecondLetter = letterPattern.length === 2;
        if (hasSecondLetter) {
            // there is a second letter
            secondLetterOptions =
                letterPattern[1] === '?' ? letters : [letterPattern[1]];
        }

        for (const firstLetterOption of firstLetterOptions) {
            if (hasSecondLetter) {
                // loop through secondLetterOptions
                for (const secondLetterOption of secondLetterOptions) {
                    const letterCombination = `${firstLetterOption}${secondLetterOption}`;
                    for (const num of this.matchingNumbers(digitPattern)) {
                        const plate = {
                            areaCode: areaCode,
                            letters: letterCombination,
                            digits: num
                        };
                        result.push(plate);
                    }
                }
            } else {
                for (const num of this.matchingNumbers(digitPattern)) {
                    const plate = {
                        areaCode: areaCode,
                        letters: firstLetterOption,
                        digits: num
                    };
                    result.push(plate);
                }
            }
        }

        return result;
    }

    static async getUsedPlates() {
        // todo only include plates as 'used' if they are
        // - at a registered vehicle
        // - at a valid reservation
        // - at a pending process

        const vehicles = await VehicleModel.find({}).lean().exec();

        // currently used plates on registered vehicles
        const registeredVehicles = vehicles.filter(
            (vehicle) => vehicle.state === 'REGISTERED'
        );
        const platesOnCars = registeredVehicles.map(
            (vehicle) => vehicle.licensePlate
        );

        // plates that have a valid reservation
        const users = await UserModel.find().lean().exec();
        let validReservations = [];
        for (const user of users) {
            if (user.licensePlateReservations) {
                for (const reservation of user.licensePlateReservations) {
                    const currentTime = new Date().getTime();
                    const expiryTime = new Date(
                        reservation.expiryDate
                    ).getTime();

                    if (!reservation.expiryDate || expiryTime > currentTime) {
                        validReservations.push(reservation);
                    }
                }
            }
        }
        const reservedPlates = validReservations.map(
            (reservation) => reservation.licensePlate
        );

        // plates in pending registration processes
        let pendingRegistrations = [];
        for (const vehicle of vehicles) {
            for (const process of vehicle.processes) {
                if (
                    process.processType === 'REGISTRATION' &&
                    process.state === 'PENDING' &&
                    process.info.licensePlate
                ) {
                    pendingRegistrations.push(process);
                }
            }
        }
        const platesInPendingRegistrations = pendingRegistrations.map(
            (p) => p.info.licensePlate
        );

        const allUsedPlatesIds = platesOnCars
            .concat(reservedPlates)
            .concat(platesInPendingRegistrations);

        const allUsedPlates = await LicensePlateModel.find({
            _id: { $in: allUsedPlatesIds }
        });

        return allUsedPlates;

        // return await LicensePlateModel.find().lean().exec();
    }

    static async getAvailablePlatesMatchingPattern(
        areaCode,
        letterPattern,
        digitPattern
    ) {
        const allPlates = this.generatePlatesMatchingPattern(
            areaCode,
            letterPattern,
            digitPattern
        );
        let usedPlates = await this.getUsedPlates();
        const availablePlates = allPlates.filter(
            (plate) =>
                !usedPlates.find(
                    (usedPlate) =>
                        plate.areaCode === usedPlate.areaCode &&
                        plate.letters === usedPlate.letters &&
                        plate.digits === usedPlate.digits
                )
        );

        return availablePlates;
    }

    static matchingNumbers(digitPattern) {
        let res = [];
        for (let num = 1; num <= 9999; num++) {
            if (this.numberMatchesPattern(num, digitPattern)) {
                res.push(num);
            }
        }
        return res;
    }

    static numberMatchesPattern(number, digitPattern) {
        const numberPositions = number.toString().split('');
        const patternPositions = digitPattern.split('');

        if (numberPositions.length != patternPositions.length) {
            return false;
        }

        for (let i = 0; i < numberPositions.length; i++) {
            const numPos = numberPositions[i];
            const patternPos = patternPositions[i];

            if (patternPos != '?' && numPos != patternPos) {
                return false;
            }
        }

        return true;
    }
};
