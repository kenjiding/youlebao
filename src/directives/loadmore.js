let binding = null;

function bindFn() {
  const sign = binding.arg || 100;
  const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
  if (scrollDistance <= sign) {
    binding.value();
  }
}

export default {
  bind(el, _binding) {
    binding = _binding;
    const selectWrap = el.querySelector('.el-table__body-wrapper');
    selectWrap.addEventListener('scroll', bindFn);
  },

  unbind(el) {
    const selectWrap = el.querySelector('.el-table__body-wrapper');
    selectWrap.removeEventListener('scroll', bindFn);
  },
};
