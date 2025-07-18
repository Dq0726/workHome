// 创建 main.js 对应的 Worker 实例
const nestedWorker = new Worker("main.js");

onmessage = function(event) {
    // 把消息传递给 main.js 对应的 Worker
    nestedWorker.postMessage(event.data);

    // 接收 main.js 对应的 Worker 返回的结果
    nestedWorker.onmessage = function(nestedEvent) {
        const data = nestedEvent.data;
        let returnStr = "";
        const intArray = data.split(";");
        for (let i = 0; i < intArray.length; i++) {
            if (parseInt(intArray[i]) % 3 === 0) {
                if (returnStr !== "") {
                    returnStr += ";";
                }
                returnStr += intArray[i];
            }
        }
        // 把结果返回给主线程
        postMessage(returnStr);
        // 关闭当前 Worker 线程
        close();
    };

};