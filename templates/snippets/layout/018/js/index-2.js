
function responsiveChange (callback = noop) {
  // Due to the way some browsers fire events, we need to manually store the
  // width of the window to use later. This reason will be further detailed
  // later in the code.
  let window_size = window.innerWidth
  // responsive changes
  window.addEventListener(
    'resize',
    throttle(() => {
      // We have to add this check to make sure the window actually resized. It
      // seems that at least Safari on iOS will fire resize events during
      // scrolling.
      if (window_size !== window.innerWidth) {
        callback()
        // when the resize is really a resize we need to reset the stored
        // `window_size`
        window_size = window.innerWidth
      }
    }, 50),
  )

  window.addEventListener('orientationchange', () => {
    callback()
    // when the resize is really a resize we need to reset the stored
    // `window_size`
    window_size = window.innerWidth
  })
}