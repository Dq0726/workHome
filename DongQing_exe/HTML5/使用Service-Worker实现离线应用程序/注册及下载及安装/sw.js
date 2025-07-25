//为安装设置回调函数
self.addEventListener("install",function(event){
    //执行安装过程
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            //缓存我们想要缓存的文件
            return cache.addAll([
                '/',
                '/index.html',
                '/styles/main.css',
                '/script/main.js'
            ]);
        }).then(function() {
                console.log('所有资源被成功缓存');
            }).catch(function(error) {
            console.log('预抓取失败:', error);
        })
    );
});
this.addEventListener('fetch', function(event) {
    event.respondWith(new Response('测试响应', {
            headers: {'Content-Type': 'text/html' }
    }));
});