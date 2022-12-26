(() => {
    let port;
    browser.runtime.onConnect.addListener(p => {
        port = p;
        port.onMessage.addListener(async e => {
            try {
                switch (e.command) {
                    case "doSavePDF":
                        let res = await browser.tabs.saveAsPDF({ "footerLeft": "", "footerCenter": "", "footerRight": "", "headerLeft": "", "headerCenter": "", "headerRight": "", "showBackgroundColors": false, "showBackgroundImages": false, "paperSizeUnit": 1, "paperHeight": 297, "paperWidth": 210 });
                        if (res == "saved" || res == "replaced") {
                            await browser.notifications.create("pdf", {
                                "type": "basic",
                                "iconUrl": browser.runtime.getURL("icons/pdf.svg"),
                                "title": "提示",
                                "message": " PDF文件保存完毕!"
                            });
                        } else {
                            await browser.notifications.create("pdf", {
                                "type": "basic",
                                "iconUrl": browser.runtime.getURL("icons/pdf.svg"),
                                "title": "提示",
                                "message": " PDF文件保存失败!"
                            });
                        };
                        await port.postMessage({ command: "afterSavePDF" });
                        await new Promise(res => {
                            setTimeout(() => {
                                browser.notifications.clear("pdf").then(res);
                            }, 3000);
                        });
                        break;
                }
            } catch (e) {
                console.log(e);
            }
        });
    });
    browser.pageAction.onClicked.addListener(async () => {
        try {
            if (port) {
                await port.postMessage({ command: "preparePage" });
            }
        } catch (e) {
            console.log(e);
        }
    });
})();
