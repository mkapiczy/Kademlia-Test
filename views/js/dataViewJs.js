function onLoad() {
    var maxDataPoints = 100000;
    var chart = new google.visualization.LineChart($('#chart')[0]);
    var data = google.visualization.arrayToDataTable([
        ['Time', 'Temperature'],
        [getTime("0"), 0]
    ]);

    var options = { 
        title: 'Temperature',
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
        if (data.getNumberOfRows() > maxDataPoints) {
            data.removeRow(0);
        }
        data.addRow([getTime(time), temperature]);
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
                chart.draw(data, options); 
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