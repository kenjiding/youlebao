export function zoomOut(event, { main }) {
  main.minimize();
}

export function resize(event, { main }) {
  const isMax = main.isMaximized();
  const isMin = main.isMinimized();
  event.sender.send('resizeContent', 'min');
  if (isMax) {
    main.setSize(1024, 768);
    main.center();
    event.sender.send('resizeContent', 'max');
  } else if (isMin) {
    main.maximize();
  } else if (!isMin && !isMax) {
    main.maximize();
  }
}

export function close(event, { main }) {
  main.close();
}
