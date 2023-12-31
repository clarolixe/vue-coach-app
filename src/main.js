import { createApp, defineAsyncComponent } from 'vue';

import router from '@/router';
import App from './App';
import store from '@/store';
import BaseCard from '@/components/ui/BaseCard';
import BaseButton from '@/components/ui/BaseButton';
import BaseBadge from '@/components/ui/BaseBadge';

const BaseDialog = defineAsyncComponent(() => import('./components/ui/BaseDialog'));

const app = createApp(App);

app.use(router);
app.use(store);

app.component('base-card', BaseCard);
app.component('base-button', BaseButton);
app.component('base-badge', BaseBadge);
app.component('base-dialog', BaseDialog);

app.mount('#app');
