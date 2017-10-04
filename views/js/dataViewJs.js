function onLoad() {
    var maxDataPoints = 100000;
    var chart = new google.visualization.LineChart($('#chart')[0]);
    var chartData = google.visualization.arrayToDataTable([
        ['Time', 'Temperature', 'Humidity'],
        [getTime("0"), 0.0, 0.0]
    ]);

    var options = { 
        title: 'Measurement',
        curveType: 'function',
        animation: {
            duration: 1000,
            easing: 'in'
        },
        legend: {
            position: 'bottom'
        }
    };

    function addDataPoint(time, humidity, temperature) { 
        if (chartData.getNumberOfRows() > maxDataPoints) {
            chartData.removeRow(0);
        }
        chartData.addRow([getTime(time), parseFloat(temperature), parseFloat(humidity)]);
    }

    function getTime(time) {
        var d = new Date(time);
        return d.toLocaleTimeString();
    }

    function doPoll() {
        $.get("data/measurements", function (response) {
            response.forEach(function (wotDevice) {
                var measurements = wotDevice.value;
                measurements.forEach(function (measurement) {
                    addDataPoint(measurement.currentTime, measurement.humidity, measurement.temperature);
                });
                chart.draw(chartData, options);
            }, this);
        });
    }

    doPoll();
}

let storeData = function () {
    document.getElementById("btnStore").disabled = true;
    let endpoint = document.getElementById("endpoint").value;

    $.post("api/kademlia/data/endpoints", {
        endpoint: endpoint
    }, function (data) {
        document.getElementById("endpoint").value = "";
        document.getElementById("btnStore").disabled = false;
    });
};