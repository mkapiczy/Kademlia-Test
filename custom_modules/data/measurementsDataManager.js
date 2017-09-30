
function MeasurementDataManager() {
    this.measurements = [];
}

MeasurementDataManager.prototype.addMeasurement = function (measurement) {
    this.measurements.push(measurement);
    console.log(this.measurements);
};

module.exports = MeasurementDataManager;