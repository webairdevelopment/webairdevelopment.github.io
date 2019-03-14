
var anim;
var elem = document.getElementById("lottie");
var animData = {
  container: elem,
  renderer: "html",
  loop: true,
  autoplay: true,
  rendererSettings: {
    progressiveLoad: true,
    preserveAspectRatio: "xMidYMid meet",
    imagePreserveAspectRatio: "xMidYMid meet"
  },
  path: "https://labs.nearpod.com/bodymovin/demo/duik/walk/data.json"
};
anim = lottie.loadAnimation(animData);
anim.setSubframe(false);

var animAPI;
anim.addEventListener("DOMLoaded", function() {
  animAPI = lottie_api.createAnimationApi(anim);
  buildPaths();
  buildGUI();
});

var controls = {
  height: 180,
  weight: 60,
  energy: 36,
  softness: 20,
  walkCycle_type: 1,
  walkCycle_speed: -3.25,
  neckAndHead_swing: 3,
  neckAndHead_softness: 10,
  body_swing: 3,
  body_updown: 5,
  body_hipsSwing: 4,
  arms_swing: 7,
  arms_shoulderSwing: 2,
  arms_softness: 5,
  feet_height: 50,
  feet_rotation: 100,
  feet_hit: 40
};

function buildPaths() {
  var softness_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,21"
  );
  animAPI.addValueCallback(softness_key_path, function(current) {
    return controls.softness;
  });
  var energy_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,20"
  );
  animAPI.addValueCallback(energy_key_path, function(current) {
    return controls.energy;
  });
  var weight_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,19"
  );
  animAPI.addValueCallback(weight_key_path, function(current) {
    return controls.weight;
  });
  var height_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,18"
  );
  animAPI.addValueCallback(height_key_path, function(current) {
    return controls.height;
  });
  var walkCycle_type_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,27"
  );
  animAPI.addValueCallback(walkCycle_type_key_path, function(current) {
    return controls.walkCycle_type;
  });
  var walkCycle_speed_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,26"
  );
  animAPI.addValueCallback(walkCycle_speed_key_path, function(current) {
    return controls.walkCycle_speed;
  });
  // Secondary
  // Neck
  var neckAndHead_swing_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,34"
  );
  animAPI.addValueCallback(neckAndHead_swing_key_path, function(current) {
    return controls.neckAndHead_swing;
  });
  var neckAndHead_softness_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,35"
  );
  animAPI.addValueCallback(neckAndHead_softness_key_path, function(current) {
    return controls.neckAndHead_softness;
  });
  // Body
  var body_swing_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,38"
  );
  animAPI.addValueCallback(body_swing_key_path, function(current) {
    return controls.body_swing;
  });
  var body_updown_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,39"
  );
  animAPI.addValueCallback(body_updown_key_path, function(current) {
    return controls.body_updown;
  });
  var body_hipsSwing_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,40"
  );
  animAPI.addValueCallback(body_hipsSwing_key_path, function(current) {
    return controls.body_hipsSwing;
  });
  // Arms
  var arms_swing_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,43"
  );
  animAPI.addValueCallback(arms_swing_key_path, function(current) {
    return controls.arms_swing;
  });
  var arms_shoulderSwing_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,44"
  );
  animAPI.addValueCallback(arms_shoulderSwing_key_path, function(current) {
    return controls.arms_shoulderSwing;
  });
  var arms_softness_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,45"
  );
  animAPI.addValueCallback(arms_softness_key_path, function(current) {
    return controls.arms_softness;
  });
  // Feet
  var feet_height_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,48"
  );
  animAPI.addValueCallback(feet_height_key_path, function(current) {
    return controls.feet_height;
  });
  var feet_rotation_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,49"
  );
  animAPI.addValueCallback(feet_rotation_key_path, function(current) {
    return controls.feet_rotation;
  });
  var feet_hit_key_path = animAPI.getKeyPath(
    "C | Walk Cycle,Effects,Walk Cycle,50"
  );
  animAPI.addValueCallback(feet_hit_key_path, function(current) {
    return controls.feet_hit;
  });
}

function buildGUI() {
  var gui = new dat.GUI();
  var main_params = gui.addFolder("Main Parameters");
  main_params.open();
  var Character = main_params.addFolder("Character");
  Character.open();
  Character.add(controls, "height", 0, 500).name("Height (cm)");
  Character.add(controls, "weight", 0, 500).name("Weight (kg)");
  Character.add(controls, "energy", 0, 250).name("Energy");
  Character.add(controls, "softness", 0, 250).name("Softness");
  var WalkCycle = main_params.addFolder("Walk Cycle");
  WalkCycle.add(controls, "walkCycle_speed", -20, 20).name("Walk Speed (kmph)");
  WalkCycle.add(controls, "walkCycle_type", { Normal: 1, Dancing: 2 }).name(
    "type"
  );
  var SecondaryControls = gui.addFolder("Secondary Controls");
  SecondaryControls.open();
  var NeckAndHead = SecondaryControls.addFolder("Neck and head");
  NeckAndHead.add(controls, "neckAndHead_swing", 0, 40).name("Neck Swing");
  NeckAndHead.add(controls, "neckAndHead_softness", 0, 250).name(
    "Neck Softness"
  );
  var NeckAndHead = SecondaryControls.addFolder("Body");
  NeckAndHead.add(controls, "body_swing", 0, 100).name("Body Swing");
  NeckAndHead.add(controls, "body_updown", 0, 100).name("Body up/down Motion");
  NeckAndHead.add(controls, "body_hipsSwing", 0, 40).name("Hips Swing");
  var Arms = SecondaryControls.addFolder("Arms");
  Arms.add(controls, "arms_swing", 0, 100).name("Arms Swing");
  Arms.add(controls, "arms_shoulderSwing", 0, 200).name("Arms Shoulder swing");
  Arms.add(controls, "arms_softness", 0, 40).name("Arms softness");
  var Feet = SecondaryControls.addFolder("Feet");
  Feet.add(controls, "feet_height", 0, 300).name("Feet Height");
  Feet.add(controls, "feet_rotation", 0, 200).name("Feet Rotation");
  Feet.add(controls, "feet_hit", 0, 500).name("Hit the Ground");
}