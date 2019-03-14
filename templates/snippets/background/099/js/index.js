function Thread(x,y,c/*color*/,w/*linewidth*/) {
  return {x, y, c, w}
}

function Braid(ox, oy, width, colors, fps) {
  const w/*thread_width*/ = width/4;
  const channel_xs = [
      ox - w/2 * 2,
      ox - w/2,
      ox + w/2,
      ox + w/2 * 2
  ];
  const channels = [
    Thread(channel_xs[0],oy,colors[0],w),
    Thread(channel_xs[1],oy,colors[1],w),
    Thread(channel_xs[2],oy,colors[2],w),
    Thread(channel_xs[3],oy,colors[3],w)
  ];
  return { channels, channel_xs, fps };
}

function draw(channels, channel_xs) {
  draw_channel_m_to_n(channels[2], channel_xs, 2, 3);
  draw_channel_m_to_n(channels[3], channel_xs, 3, 1);
  draw_channel_m_to_n(channels[1], channel_xs, 1, 0);
  draw_channel_m_to_n(channels[0], channel_xs, 0, 2);
}

function draw_channel_m_to_n(channel, channel_xs, m, n) {
  ctx.beginPath();
  ctx.moveTo(channel.x, channel.y);
  channel.x = channel_xs[n];
  channel.y += channel.w * 1.5;
  ctx.lineTo(channel.x, channel.y);
  ctx.lineWidth = channel.w * THREAD_OVERLAY_FACTOR;
  ctx.strokeStyle = channel.c;
  ctx.stroke();
}

function update_channels(channels) {
  //o->nu
  //2to3
  //3to1
  //1to0
  //0to2
  const olds = [...channels];
  channels[0] = olds[1];
  channels[1] = olds[3];
  channels[2] = olds[0];
  channels[3] = olds[2];
}

//
// main
//
const N_BRAIDS = 32;
const THREAD_OVERLAY_FACTOR = 0.8;
const BRAID_SCALE_X = 1;

const ctx = elcanvas.getContext('2d');
const braids = [];
{ // create braids
  const CAN_WIDTH = elcanvas.width;
  for (let i = 0; i < N_BRAIDS; ++i) {
    const braid_width = CAN_WIDTH/N_BRAIDS * BRAID_SCALE_X;
    const fps = 10 + 10 * Math.random();
    const ox = CAN_WIDTH/N_BRAIDS*(i+0.5);
    const oy = -1 * Math.random() *32;
    const braid = Braid(ox, oy, braid_width, [
      `hsla(${Math.random() * 360}, 50%, 50%, 1.0)`,
      `hsla(${Math.random() * 360}, 50%, 40%, 1.0)`,
      `hsla(${Math.random() * 360}, 60%, 50%, 1.0)`,
      `hsla(${Math.random() * 360}, 50%, 55%, 1.0)`
    ], fps);
    braids.push(braid);
  }
}

ctx.lineCap = "round";
for (const braid of braids) {
  (function f() {
    if (braid.channels[0].y <= elcanvas.height) {
      draw(braid.channels, braid.channel_xs);
      update_channels(braid.channels);
      setTimeout(f, 1000/ braid.fps);
    }  
  }());
}