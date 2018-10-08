import { getWindow } from './pollyfill';
import { getLocationHref, oneOf } from './util'
import { setFlag, getFlag } from './util'
const _window = getWindow();

let instance;
export default class Behavior {
  constructor(config = {
    behavior: 10,
    excludeUrl: [CONS.SERVER_URL]
  }) {
    this.behaviorList = []
    this.config = config;
    this.addBehavior = this.addBehavior.bind(this)
    if (this.config.behavior && !this.bindBehaviorSuccess) {
      this.bindEvent()
    }
  }
  clearBehaviors () {
    this.behaviorList = []
  }
  //?????
  setConfig (config = {}) {
    if (!config.behavior && this.config.behavior) {
      this.behaviorList = []
      this.removeBindEvent();
    } else if (config.behavior && !this.config.behavior) {
      this.bindEvent()
    }
    this.config = { ...this.config, ...config }
    if (this.config.behavior) {
      this.behaviorList = this.behaviorList.slice(-this.config.behavior, this.behaviorList.length)
    }
  }
  getFetchBehavior (e) {
    e = e.detail;
    return {
      type: "FETCH",
      page: getLocationHref(),
      method: e.method,
      url: e.url,
      time: Date.now()
    }
  }
  getPageBehavior (e) {
    return {
      oldURL: e.oldURL || document.referrer || '',
      newURL: e.newURL || e.target && e.target.URL || '',
      type: "PAGE",
      time: Date.now()
    }
  }

  getClickBehavior (e) {
    return {
      type: 'CLICK',
      time: Date.now(),
      page: getLocationHref(),
      id: e.target.id || '',
      class: e.target.className,
      html: e.target.outerHTML.substr(0, 50)
    }
  }
  bindEvent () {
    if (_window.addEventListener && !getFlag('watchBehavior')) {
      _window.addEventListener('click', this.addBehavior, true)
      _window.addEventListener('DOMContentLoaded', this.addBehavior)
      if (typeof _window.onpopstate === 'undefined') {
        _window.addEventListener('hashchange', this.addBehavior)
      }
      _window.addEventListener('historyPushState', this.addBehavior)
      _window.addEventListener('historyPopstate', this.addBehavior)
      if (_window.XMLHttpRequest) {
        _window.addEventListener('fetchLoadEnd', this.addBehavior);
      }
      setFlag('watchBehavior', true);
    }
  }
  removeBindEvent () {
    if (_window.addEventListener) {
      _window.removeEventListener('click', this.addBehavior)
      _window.removeEventListener('DOMContentLoaded', this.addBehavior)
      if (typeof _window.onpopstate === 'undefined') {
        _window.removeEventListener('hashchange', this.addBehavior)
      }
      _window.removeEventListener('historyPushState', this.addBehavior)
      _window.removeEventListener('historyPopstate', this.addBehavior)
      if (_window.XMLHttpRequest) {
        _window.removeEventListener('fetchLoadEnd', this.addBehavior);
      }
      this.bindBehaviorSuccess = false;
    }
  }
  addBehavior (e) {
    if (e.type === 'click') {
      this.behaviorList.push(this.getClickBehavior(e))
    } else if (e.type === "hashchange") {
      this.behaviorList.push(this.getPageBehavior(e))
    } else if (e.type === 'historyPushState' || e.type === 'historyPopstate') {
      this.behaviorList.push(this.getPageBehavior(e.detail))
    } else {
      return;
    }

    //console.log("用户行为:",e)
    if (this.behaviorList.length > this.config.behavior) {
      this.behaviorList = this.behaviorList.slice(-this.config.behavior, this.behaviorList.length)
    }
  }
}

Behavior.init = (config) => {
  if (!instance) {
    instance = new Behavior(config);
  } else if (config) {
    instance.setConfig(config)
  }
  return instance;
}
