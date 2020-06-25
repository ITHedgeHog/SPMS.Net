﻿var simplemde = new SimpleMDE({
    autosave: {
        enabled: false
    },
    element: $("#Content")[0]
});

simplemde.codemirror.on("keyup", function () {
    change();
});

simplemde.codemirror.on("keyHandled", function () {
    change();
});

simplemde.codemirror.on("click", function (stuff) {
    console.log(stuff);
});

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/authoringHub")
    .build();
connection.start().then(function() {
    console.log('Started');
    var channel = "authoring-" + $("#Id").val();
    connection.invoke("JoinGroup", channel).catch((err) => { console.error(err)});
}).catch(function (err) { console.error(err) });

connection.on("ReceiveText", (text) => {
    //editor.value = text;
    //editor.focus();
    //editor.setSelectionRange(editor.value.length, editor.value.length);

    console.log(text);
    simplemde.value(text);
    simplemde.focus();
});

connection.on("AddPlayer",
    (text) => {
        $('#author-' + text).removeClass("d-none");
    });

connection.on("RemovePlayer",
    (text) => {
        $('#author-' + text).addClass("d-none");
    });

function change() {
    connection.invoke("SendMessage", simplemde.value()).catch(err => console.error(err));
}

function autoSave() {
    var dirtyElements = $('#authorpost').find('[data-dirty=true]').add('[form=authorpost][data-dirty=true]');
    var autosaveElements = $('#authorpost').find('[data-autosave=true]').add('[form=authorpost][data-autosave=true]');

    var elementsToPost = $.merge(dirtyElements, autosaveElements);

    //console.log(hiddenElements);
    if (dirtyElements.length > 0) {
        $('#saving').toggleClass('d-none');
        var data = elementsToPost.serialize() + '&Content=' + simplemde.value();
        $.post('/player/author/post/autosave', data, function (data) {
            $('#Id').val(data);
            dirtyElements.attr('data-dirty', false);
            $('#lastSave').removeClass('d-none');
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = (today.getHours() < 10 ? '0' : '') + today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ":" + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
            var dateTime = date + ' ' + time;
            $('#lastSaveTime').text(dateTime);
            $('#saving').toggleClass('d-none');
        });
    }
}

function backToWritingPortal() {
    autoSave();
    var channel = "authoring-" + $("#Id").val();
    connection.server.leaveGroup(channel);
}
