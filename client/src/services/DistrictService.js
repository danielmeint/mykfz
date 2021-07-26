"use strict";

import HttpService from "./HttpService";

export default class DistrictService {
  constructor() {}

  static baseURL() {
    return `http://${location.hostname}:5000/districts`;
  }

  static getDistricts() {
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

  static getDistrict(id) {
    return new Promise((resolve, reject) => {
      HttpService.get(
        `${DistrictService.baseURL()}/${id}`,
        function (data) {
          if (data != undefined || Object.keys(data).length !== 0) {
            resolve(data);
          } else {
            reject("Error while retrieving district");
          }
        },
        function (textStatus) {
          reject(textStatus);
        }
      );
    });
  }

  static getDistrictByUser(user) {
    return new Promise((resolve, reject) => {
      HttpService.get(
        `${DistrictService.baseURL()}/user/${user}`,
        function (data) {
          if (data != undefined || Object.keys(data).length !== 0) {
            resolve(data);
          } else {
            reject("Error while retrieving district");
          }
        },
        function (textStatus) {
          reject(textStatus);
        }
      );
    });
  }

  static updateDistrict(district) {
    return new Promise((resolve, reject) => {
      HttpService.put(
        `${this.baseURL()}/${district._id}`,
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

  static getVehicles(districtId) {
    return new Promise((resolve, reject) => {
      HttpService.get(
        `${DistrictService.baseURL()}/${districtId}/vehicles`,
        function (data) {
          if (data != undefined || Object.keys(data).length !== 0) {
            resolve(data);
          } else {
            reject("Error while retrieving district");
          }
        },
        function (textStatus) {
          reject(textStatus);
        }
      );
    });
  }
}
