import store from '@/plugins/store';

export default function hasPermission(value, every = true) {
  const permission = store.getters['menu/openMenus'] || [];
  // if (permission.length === 0) return true;
  let valid;
  if (Array.isArray(value)) {
    const method = every ? 'every' : 'some';
    valid = value[method](code => permission.includes(Number(code)));
  } else {
    valid = permission.includes(Number(value));
  }
  return valid;
}

export function authorization(permission) {
  return new Promise((resolve) => {
    if (hasPermission(permission)) {
      resolve(true);
      return;
    }
    this.$createAuthDialog({
      $attrs: {
        visible: true,
        permission: Number(permission),
      },
      $events: {
        result: (is) => {
          resolve(is);
        },
      },
    });
  });
}
