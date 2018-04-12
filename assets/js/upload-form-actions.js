$(function () {

    console.log("jquery loaded");

    $("#copy-url").on("click", function () {

        let url = $("#url");


        //copy url content to clipboard
        copyToClipboard(url);

        //show status to user.
        let status = $("#status");

        status.text("Item copied to clipboard!");
        status.fadeIn(500);

        setTimeout(() => {
            status.fadeOut(500)


        }, 3000);


    });


});
