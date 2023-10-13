<template>
  <div>
    <base-dialog :show='!!error' title='An error occurred' @close='handleError'>
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show='isLoading' title='Authenticating...' fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent='submitForm'>
        <div class='form-control'>
          <label for='email'>E-Mail</label>
          <input type='email' id='email' v-model.trim='email'>
        </div>
        <div class='form-control'>
          <label for='password'>Password</label>
          <input type='password' id='password' v-model.trim='password'>
        </div>
        <p v-if='!formIsValid'>Please enter a valid email and password (must be at least 6 characters long).</p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type='button' mode='flat' @click='switchAuthMode'>{{ switchModeButtonCaption }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
import BaseButton from '@/components/ui/BaseButton';
import BaseCard from '@/components/ui/BaseCard';
import BaseDialog from '@/components/ui/BaseDialog';
import BaseSpinner from '@/components/ui/BaseSpinner';

export default {
  name: 'UserAuth',
  components: { BaseSpinner, BaseDialog, BaseCard, BaseButton },
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'Login',
      isLoading: false,
      error: null
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'Login') {
        return 'Login';
      } else {
        return 'Sing Up';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'Login') {
        return 'Sing Up instead';
      } else {
        return 'Login instead';
      }
    }
  },
  methods: {
    async submitForm() {
      this.formIsValid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoading = true;

      const actionsPayload = {
        email: this.email,
        password: this.password
      };

      try {
        if (this.mode === 'Login') {
          await this.$store.dispatch('login', actionsPayload);
        } else {
          await this.$store.dispatch('singup', actionsPayload);
        }
        const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
        this.$router.replace(redirectUrl);
      } catch (err) {
        this.error = err.message || 'Failed to authenticate, try later.';
      }

      this.isLoading = false;

    },
    switchAuthMode() {
      if (this.mode === 'Login') {
        this.mode = 'Singup';
      } else {
        this.mode = 'Login';
      }
    },
    handleError() {
      this.error = null;
    }
  }
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>