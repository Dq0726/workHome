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
                '/script/main.js',
                '/fallback.html'
            ]);
        }).then(function() {
                console.log('所有资源被成功缓存');
            }).catch(function(error) {
            console.log('预抓取失败:', error);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(resp) {
            // 如果在缓存中找到响应，则直接返回
            if (resp) {
                return resp;
            }
            
            // 否则尝试通过网络获取
            return fetch(event.request).then(function(response) {
                // 检查响应是否有效（例如不是404或500错误）
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    // 如果是无效响应，返回fallback.html
                    return caches.match('/fallback.html');
                }
                
                // 如果是有效响应，将其添加到缓存并返回
                return caches.open('v1').then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(function(error) {
                // 网络请求出现错误（如断网），返回fallback.html
                console.log('获取资源失败:', error);
                return caches.match('/fallback.html');
            });
        })
    );
});