let storeData = function () {
    document.getElementById("btnStore").disabled = true; 
    let name = document.getElementById("name").value;
    let value = document.getElementById("value").value;
    
    $.post("api/kademlia/nodes/data", {name: name, value: value}, function(data) {
        let test = data;
        document.getElementById("name").value = "";
        document.getElementById("value").value = "";
        document.getElementById("btnStore").disabled = false;
        // Update values
    });
};