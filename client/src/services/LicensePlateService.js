'use strict';

import HttpService from './HttpService';

export default class LicensePlateService {
    constructor() {}

    static baseURL() {
        return `http://${location.hostname}:3000/licensePlates`;
    }

    static getFreePlatesForPrefix(prefix) {
        return [];
    }

    static asString(licensePlateObj) {
        return `${licensePlateObj.areaCode} – ${licensePlateObj.letters} ${licensePlateObj.digits}`;
    }

    static getLicensePlates() {
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

    // TODO
    // static getLicensePlatesForUser(user_id) {
    //     return new Promise((resolve, reject) => {
    //         HttpService.get(
    //             `${LicensePlateService.baseURL()}?owner=${user_id}`,
    //             function (data) {
    //                 resolve(data);
    //             },
    //             function (textStatus) {
    //                 reject(textStatus);
    //             }
    //         );
    //     });
    // }

    static getLicensePlate(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${LicensePlateService.baseURL()}/${id}`,
                function (data) {
                    if (data != undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving licensePlate');
                    }
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static getAvailableLicensePlates(query) {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${LicensePlateService.baseURL()}/available?areaCode=${
                    query.areaCode
                }&letters=${query.letters}&digits=${query.digits}`,
                function (data) {
                    if (data != undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving licensePlate');
                    }
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static deleteLicensePlate(id) {
        return new Promise((resolve, reject) => {
            HttpService.remove(
                `${LicensePlateService.baseURL()}/${id}`,
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

    static updateLicensePlate(licensePlate) {
        return new Promise((resolve, reject) => {
            HttpService.put(
                `${this.baseURL()}/${licensePlate._id}`,
                licensePlate,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static createLicensePlate(licensePlate, isReservation) {
        licensePlate['isReservation'] = isReservation;
        return new Promise((resolve, reject) => {
            HttpService.post(
                LicensePlateService.baseURL(),
                licensePlate,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                }
            );
        });
    }

    static async getFreePlates() {
        var myHeaders = new Headers();
        myHeaders.append('Connection', 'keep-alive');
        myHeaders.append('Pragma', 'no-cache');
        myHeaders.append('Cache-Control', 'no-cache');
        myHeaders.append(
            'sec-ch-ua',
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"'
        );
        myHeaders.append('sec-ch-ua-mobile', '?0');
        myHeaders.append('Upgrade-Insecure-Requests', '1');
        myHeaders.append('Origin', 'https://www.buergerserviceportal.de');
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        myHeaders.append(
            'User-Agent',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
        );
        myHeaders.append(
            'Accept',
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        );
        myHeaders.append('Sec-Fetch-Site', 'same-origin');
        myHeaders.append('Sec-Fetch-Mode', 'navigate');
        myHeaders.append('Sec-Fetch-User', '?1');
        myHeaders.append('Sec-Fetch-Dest', 'document');
        myHeaders.append(
            'Referer',
            'https://www.buergerserviceportal.de/bayern/lkrerding/igvwkz?portal:componentId=f88d6803-d54d-4418-833b-098e47c8b7f8&interactionstate=JBPNS_rO0ABXcsAAZBVUZSVUYAAAABAANXS1oAB01BTkRBTlQAAAABAANLRloAB19fRU9GX18*&portal:type=action'
        );
        myHeaders.append('Accept-Language', 'en-US,en;q=0.9,de;q=0.8');
        myHeaders.append(
            'Cookie',
            'JSESSIONID=EE877A809C5FFB2CFC8E7B11A5896AB5.ajp13-bsp-by-prod-u; JSESSIONID=EE02C518B1A2913A02857C62EE90E3FB.ajp13-bsp-by-prod-b'
        );

        var urlencoded = new URLSearchParams();
        urlencoded.append('WKZ_ERKENN_Z', 'DM');
        urlencoded.append('WKZ_ZIFFERN', '???');
        urlencoded.append('WKZ_SUCHMERKMAL', 'NULL');
        urlencoded.append('BTN_WKZSUCHE', 'suchen');
        urlencoded.append('ZEITSTEMPEL', '2021061015593693');

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(
            'https://www.buergerserviceportal.de/bayern/lkrerding/igvwkz?navigationalstate=JBPNS_rO0ABXdXAAtaRUlUU1RFTVBFTAAAAAEAEDIwMjEwNjEwMTU1OTA1NzUACkJUTl9XRUlURVIAAAABAAZ3ZWl0ZXIACkZSRUlGRUxEMDEAAAABAAFUAAdfX0VPRl9f&portal:componentId=f88d6803-d54d-4418-833b-098e47c8b7f8&interactionstate=JBPNS_rO0ABXcsAAZBVUZSVUYAAAABAANXS1oAB01BTkRBTlQAAAABAANLRloAB19fRU9GX18*&portal:type=action',
            requestOptions
        )
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error('error', error));
    }
}
