function blockPageForloading() {
    $.blockUI({
        css: {
            border: 'none',
            padding: '10px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        },
        message: 'On est de charger votre page'
    });
}

function unlockPageForLoading() {
    $.unblockUI();
}