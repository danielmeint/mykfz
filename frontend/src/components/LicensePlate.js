import React from 'react';

const LicensePlate = ({ vehicleState, licensePlate }) => {
    const plateText =
        !vehicleState || vehicleState == 'REGISTERED'
            ? licensePlate.areaCode +
              ' - ' +
              licensePlate.letters.toUpperCase() +
              ' ' +
              licensePlate.digits
            : vehicleState;

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative'
            }}
        >
            <img
                style={{ width: '200px' }}
                src="https://t3.ftcdn.net/jpg/00/11/79/08/240_F_11790850_Gi4UC9cwGMUMGWtZhSP4yKpFg3tqlPis.jpg"
                alt="License Plate"
            />
            <div
                style={{
                    position: 'absolute',
                    margin: '10px 0px 0px 20px',
                    fontSize: '20px'
                }}
            >
                {plateText}
            </div>
        </div>
    );
};

export default LicensePlate;
