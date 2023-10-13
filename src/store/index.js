import { createStore } from 'vuex';

import coachesModule from './modules/coaches/index';
import requestModule from './modules/requests/index';
import authModule from './modules/auth/index';

const store = createStore({
    modules: {
      coaches: coachesModule,
      requests: requestModule,
      auth: authModule
    },
    state() {
      return {};
    },
    mutations: {},
    actions: {},
    getters: {}
  })
;

export default store;