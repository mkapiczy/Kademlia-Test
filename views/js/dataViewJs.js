let storeData = function () {
    document.getElementById("btnStore").disabled = true; 
    let endpoint = document.getElementById("endpoint").value;

    $.post("api/kademlia/data/endpoints", {endpoint: endpoint}, function(data) {
        document.getElementById("endpoint").value = "";
        document.getElementById("btnStore").disabled = false;
        // Update values
    });
};