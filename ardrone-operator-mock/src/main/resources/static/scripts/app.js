

console.log("Hi!");

function hideNotifications() {
    $("#error-notification").hide();
    $("#success-notification").hide();
}

function mockOperator(ev) {
    var hostname = $("#hostname-input").val();
    var requestBody = {
        "hostName": hostname,
        "token": $("#token-input").val()
    };
    var loadingIcon =  $("#loading-icon");
    loadingIcon.show();
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        success: function(data){
            var successNotification = $("#error-notification");
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
        url: '/control'
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