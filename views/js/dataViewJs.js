var storeData = function () {
    document.getElementById("btnStore").disabled = true; 
    var name = document.getElementById("name").value;
    var value = document.getElementById("value").value;
    
    $.post("api/kademlia/nodes/data", {name: name, value: value}, function(data) {
        var test = data;
        document.getElementById("name").value = "";
        document.getElementById("value").value = "";
        document.getElementById("btnStore").disabled = false;
        // Update values
    });
};