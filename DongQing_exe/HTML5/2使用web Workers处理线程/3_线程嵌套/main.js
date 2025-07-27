
onmessage = function(event) {
       var intArray=new Array(100);   // 随机数组
    var intStr="";         // 将随机数组用字符串进行连接
    // 生成100个随机数
    for(var i=0;i<100;i++)
    {
        intArray[i]=parseInt(Math.random()*100);
        if(i!=0)
            intStr+=";";       // 用分号作随机数组的分隔符
        intStr+=intArray[i];
    }
    postMessage( intStr );
    // 关闭当前 Worker 线程
    close();
}