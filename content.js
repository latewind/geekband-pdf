(() => {
    let port = browser.runtime.connect({});
    let oldstr;
    port.onMessage.addListener(async e => {
        try {
            let sel = document.querySelector(".ArticleContent_audio-course-wrapper_251E1");
            if (sel) {
                window.stop();
            }

            switch (e.command) {
                case "preparePage":
                    let newstr = document.getElementsByClassName("ArticleContent_audio-course-wrapper_251E1")[0].innerHTML;
                    oldstr = document.body.innerHTML;
                    document.body.innerHTML = newstr;
                    await port.postMessage({ command: "doSavePDF" });
                    break;
                case "afterSavePDF":
                    document.body.innerHTML = oldstr;
                    location.reload();
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    });
})();