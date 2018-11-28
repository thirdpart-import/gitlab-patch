import Vue from 'vue';
import { mapActions } from 'vuex';
import Translate from '~/vue_shared/translate';
import ide from './components/ide.vue';
import store from './stores';
import router from './ide_router';
import { convertPermissionToBoolean } from '../lib/utils/common_utils';

Vue.use(Translate);

/**
 * Initialize the IDE on the given element.
 *
 * @param {Element} el - The element that will contain the IDE.
 * @param {Object} options - Extra options for the IDE (Used by EE).
 * @param {(e:Element) => Object} options.extraInitialData -
 *   Function that returns extra properties to seed initial data.
 * @param {Component} options.rootComponent -
 *   Component that overrides the root component.
 */
export function initIde(el, options = {}) {
  if (!el) return null;

  const {
    extraInitialData = () => ({}),
    rootComponent = ide,
  } = options;

  return new Vue({
    el,
    store,
    router,
    created() {
      this.setEmptyStateSvgs({
        emptyStateSvgPath: el.dataset.emptyStateSvgPath,
        noChangesStateSvgPath: el.dataset.noChangesStateSvgPath,
        committedStateSvgPath: el.dataset.committedStateSvgPath,
        pipelinesEmptyStateSvgPath: el.dataset.pipelinesEmptyStateSvgPath,
        promotionSvgPath: el.dataset.promotionSvgPath,
      });
      this.setLinks({
        ciHelpPagePath: el.dataset.ciHelpPagePath,
        webIDEHelpPagePath: el.dataset.webIdeHelpPagePath,
      });
      this.setInitialData({
        clientsidePreviewEnabled: convertPermissionToBoolean(el.dataset.clientsidePreviewEnabled),
        ...extraInitialData(el),
      });
    },
    methods: {
      ...mapActions(['setEmptyStateSvgs', 'setLinks', 'setInitialData']),
    },
    render(createElement) {
      return createElement(rootComponent);
    },
  });
}

// tell webpack to load assets from origin so that web workers don't break
export function resetServiceWorkersPublicPath() {
  // __webpack_public_path__ is a global variable that can be used to adjust
  // the webpack publicPath setting at runtime.
  // see: https://webpack.js.org/guides/public-path/
  const relativeRootPath = (gon && gon.relative_url_root) || '';
  const webpackAssetPath = `${relativeRootPath}/assets/webpack/`;
  __webpack_public_path__ = webpackAssetPath; // eslint-disable-line camelcase
}

/**
 * Start the IDE.
 *
 * @param {Objects} options - Extra options for the IDE (Used by EE).
 */
export function startIde(options) {
  document.addEventListener('DOMContentLoaded', () => {
    const ideElement = document.getElementById('ide');
    if (ideElement) {
      resetServiceWorkersPublicPath();
      initIde(ideElement, options);
    }
  });
}
