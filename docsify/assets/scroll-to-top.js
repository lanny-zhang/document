var CONFIG = {
    auto: true,
    text: '',
    right: 15,
    bottom: 15,
    offset: 500
};
var install = function (hook, vm) {
    var opts = vm.config.scrollToTop || CONFIG;
    CONFIG.auto = opts.auto && typeof opts.auto === 'boolean' ? opts.auto : CONFIG.auto;
    CONFIG.text = opts.text && typeof opts.text === 'string' ? opts.text : CONFIG.text;
    CONFIG.right = opts.right && typeof opts.right === 'number' ? opts.right : CONFIG.right;
    CONFIG.bottom = opts.bottom && typeof opts.bottom === 'number' ? opts.bottom : CONFIG.bottom;
    CONFIG.offset = opts.offset && typeof opts.offset === 'number' ? opts.offset : CONFIG.offset;
    var onScroll = function (e) {
        if (!CONFIG.auto) {
            return;
        }
        var offset = window.document.documentElement.scrollTop;
        var $scrollBtn = Docsify.dom.find('span.scroll-to-top');
        $scrollBtn.style.display = offset >= CONFIG.offset ? 'flex' : 'none';
    };
    hook.mounted(function () {
        var offset = window.document.documentElement.scrollTop;
        var scrollBtn = document.createElement('span');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<svg width="24" height="24"  viewBox="0 0 24 24"><path fill="#fff" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>';
        scrollBtn.style.display = offset >= CONFIG.offset ? 'flex' : 'none';
        scrollBtn.style.overflow = 'hidden';
        scrollBtn.style.position = 'fixed';
        scrollBtn.style.right = CONFIG.right + 'px';
        scrollBtn.style.bottom = CONFIG.bottom + 'px';
        scrollBtn.style.width = '54px';
        scrollBtn.style.height = '54px';
        scrollBtn.style.background = '#87B6F9';
        scrollBtn.style.color = '#fff';
        scrollBtn.style.border = 'none';
        scrollBtn.style.borderRadius = '60px';
        scrollBtn.style.lineHeight = '42px';
        scrollBtn.style.fontSize = '16px';
        scrollBtn.style.textAlign = 'center';
        scrollBtn.style.cursor = 'pointer';
        scrollBtn.style.justifyContent = 'center';
        scrollBtn.style.alignItems = 'center';
        scrollBtn.style.boxShadow = '0 2px 5px 0 rgba(0,0,0,.26)';
        var textNode = document.createTextNode(CONFIG.text);
        scrollBtn.appendChild(textNode);
        document.body.appendChild(scrollBtn);
        window.addEventListener('scroll', onScroll);
        scrollBtn.onclick = function (e) {
            e.stopPropagation();
            var step = window.scrollY / 15;
            var scroll = function () {
                window.scrollTo(0, window.scrollY - step);
                if (window.scrollY > 0) {
                    setTimeout(scroll, 15);
                }
            };
            scroll();
        };
    });
};
$docsify.plugins = [].concat(install, $docsify.plugins);
