import scroll from 'cube-ui/lib/scroll';

export default {
  name: 'YchScroll',

  functional: true,

  render(h, context) {
    let options = context.props.options || {};
    options = options.mouseWheel ? options : Object.assign(
      context.props.options || {},
      { mouseWheel: true },
    );
    context.props.options = options;
    return h(
      scroll,
      context.data,
      context.children,
    );
  },
};
