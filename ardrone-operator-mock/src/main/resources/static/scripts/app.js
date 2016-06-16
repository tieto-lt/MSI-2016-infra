

console.log("Hi!");

function hideNotifications() {
    $("#error-notification").hide();
    $("#success-notification").hide();
}

function mockOperator(ev) {
    var hostname = $("#hostname-input").val();
    var delay = $("#delay-input").val();
    var requestBody = {
        "hostName": hostname,
        "token": $("#token-input").val()
    };
    var loadingIcon =  $("#loading-icon");
    loadingIcon.show();
    var url = '/control';
    console.log(delay);
    if (delay && delay > 0) {
        url += "?delay=" + delay * 1000;
    }

    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        success: function(data){
            var successNotification = $("#success-notification");
            successNotification.show();
            successNotification.text("Completed!");
            loadingIcon.hide();
        },
        error: function(res) {
            var errorNotification = $("#error-notification");
            errorNotification.show();
            errorNotification.text(res.responseJSON.errorMsg);
            loadingIcon.hide();
        },
        processData: false,
        type: 'POST',
        url: url
    });
    $("#loading-icon").addClass("spinning");
    ev.preventDefault();
    localStorage.setItem("hostname", hostname);
}




$(document ).ready(function() {
    var frm = $('#mock-operator-form');
    frm.submit(mockOperator);
    $("#hostname-input").val(localStorage.getItem("hostname"))
});