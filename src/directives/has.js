import hasPermission from '@/utils/has-permission';
import store from '@/plugins/store';

export default {
  componentUpdated(el, { value, arg = 'true' }) {
    const menuRules = store.state.menu.menuRoles || [];
    if (!el.parentNode || menuRules.length === 0) return;
    const valid = hasPermission(value, arg === 'true');
    valid || el.parentNode.removeChild(el);
  },
};
