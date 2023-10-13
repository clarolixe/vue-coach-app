let timer;

export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    didAutoLogout(state) {
      state.didAutoLogout = true;
    }
  },
  actions: {
    async auth(context, payload) {
      const mode = payload.mode;
      let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOHD2g-yxFaHew3Y_Z8a22bnFboWR29fo';

      if (mode === 'singup') {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOHD2g-yxFaHew3Y_Z8a22bnFboWR29fo';
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.message || 'Failed to authenticate.');
        throw error;
      }

      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId
      });
    },
    autoLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      if (token && userId) {
        context.commit('setUser', {
          token: token,
          userId: userId
        });
      }
    },
    async login(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'login'
      });
    },
    async singup(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'singup'
      });
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');

      clearTimeout(timer);

      context.commit('setUser', {
        token: null,
        userId: null
      });
    },
    autoLogout(context) {
      context.dispatch('logout');
      context.commit('didAutoLogout');
    }
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    }
  }
};