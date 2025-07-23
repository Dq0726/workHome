onmessage = function (event) {
    var data = event.data;
    var returnStr = "";          // 将3的倍数拼接成字符串并返回

    // 检查 data 是否存在且非空字符串
    if (typeof data !== 'string' || data.trim() === '') {
        postMessage(returnStr);
        return;
    }

    // 使用 split(";") 分割字符串并过滤有效数字
    var intArray = data.split(";")
        .map(item => parseInt(item, 10))  // 转换为整数
        .filter(item => !isNaN(item));   // 过滤掉 NaN

    for (var i = 0; i < intArray.length; i++) {
        if (intArray[i] % 3 == 0) {      // 能否被3整除
            if (returnStr != "") {
                returnStr += ";";
            }
            returnStr += intArray[i];
        }
    }
    postMessage(returnStr); // 返回3的倍数拼接成的字符串
}