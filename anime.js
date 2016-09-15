var anime_config = {
    animationConstruct: function(els2ani, aniTriggerEl) {
        return {
            init: function() {
                document.body.style.opacity = '0.2';
                this.animate(document.body, 110, 0.06);
            },
            mousewheelEvt: (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel',
            restore: function() {
				els2ani.forEach(function(i) {
					anime_config.instance.animate(i, 110, 0.03);
				});
            },
            scrollTopCurrentData: Number(),
            scrollTop: function() {
                return (document.body.scrollTop || document.documentElement.scrollTop);
            },
            deanimate: function() {
                els2ani.forEach(function(i) {
                    i.style.opacity = '0.2';
                });
            },
            aniNonActiveState: function() {
				var returnable;
				els2ani.forEach(function(i) {
				   returnable = i.style.opacity < 1 ? true : false;
                });
                return returnable;
            },
            animate: function(el, time, step, reverse) {
                var _interval,
                    direct = function() {
                        if (!el.style.opacity.match(/^1[.]/)) {
                            el.style.opacity = el.style.opacity ? parseFloat(el.style.opacity) + step : step;
                        } else {
                            clearInterval(_interval);
							el.style.opacity = 1;
                        }
                    },
                    obverse = function() {
						els2ani.forEach(function(i) {
								if (el.style.opacity > 0) {
									i.style.opacity = parseFloat(i.style.opacity) - step;
								} else {
									clearInterval(_interval);
									i.style.opacity = 0;
								}
						});
                    };
					if(!_interval){
						_interval = setInterval(function() {
							reverse ? obverse() : direct();
						}, time);
					}
            },
            handler: function(e) {
                var _anime_config = {
                    runOnce: false,
                    event: window.event || e,
                    delta: (window.event || e).type == anime_config.instance.mousewheelEvt && (window.event || e).detail ? (window.event || e).detail * (-120) : (window.event || e).type == anime_config.instance.mousewheelEvt && (window.event || e).wheelDelta,
                    upwards: function() {
                        return this.delta ? this.delta >= 120 : anime_config.instance.scrollTopCurrentData > anime_config.instance.scrollTop();
                    },
                    downwards: function() { 
                        return this.delta ? this.delta <= -120 : anime_config.instance.scrollTopCurrentData < anime_config.instance.scrollTop();
                    },
                    isAllTheWayDown: function() {
                        return window.innerHeight + (els2ani[0].offsetHeight / 2) + (window.scrollY ? window.scrollY : window.pageYOffset) >= (document.body.offsetHeight);
                    },
                    ani4short: function() {
                        els2ani.forEach(function(i) {
                            anime_config.instance.animate(i, 110, 0.03, true);
                        });
                    },
                    isAllTheWayUp: function() {
                        return document.body.scrollTop == 0;
                    },
                };
                if (_anime_config.downwards() && anime_config.instance.scrollTop() > aniTriggerEl.offsetTop - aniTriggerEl.scrollHeight) {
					_anime_config.ani4short();
                }
                if (_anime_config.upwards() && anime_config.instance.aniNonActiveState()) {
					anime_config.instance.restore();
                }
                anime_config.instance.scrollTopCurrentData = anime_config.instance.scrollTop();
            }
        }
    },
    domReady: function(callback) {
        anime_config.eventsBinder(document, 'DOMContentLoaded', callback);
        anime_config.eventsBinder(document, 'onreadystatechange', function() {
            if (document.readyState === 'complete') {
                callback();
            }
        });
    },
    eventsBinder: function(El, event, handler) {
        if (El && El.addEventListener) {
            El.addEventListener(event, handler);
        } else if (El && El.attachEvent) {
            El.attachEvent('on' + event, handler);
        }
    }
};
anime_config.domReady(function() {
	anime_config.instance = new anime_config.animationConstruct([$('#textarea')[0], $('#drag-and-drop')[0]], $('#drag-and-drop')[0]);
    anime_config.instance.init();
    anime_config.eventsBinder(document, anime_config.instance.mousewheelEvt, anime_config.instance.handler);
    anime_config.eventsBinder(document, 'keyup', anime_config.instance.handler);
    anime_config.eventsBinder(document, 'mousedown', anime_config.instance.handler);
    anime_config.eventsBinder(document, 'touchend', anime_config.instance.handler);
    anime_config.eventsBinder(window, 'touchend', anime_config.instance.handler);
});