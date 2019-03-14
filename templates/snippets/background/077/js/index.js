var canvas = d3.select("canvas");

var ctx = canvas.node().getContext("2d");

var canvasWidth = +canvas.attr("width"),
  canvasHeight = +canvas.attr("height");

var projection = d3
  .geoHammer()
  .rotate(130, 0, 0)
  .fitSize([canvasWidth, canvasHeight], {
    type: "Sphere"
  });

var geoPathGenerator = d3
  .geoPath()
  .projection(projection)
  .context(ctx);

d3
  .json("https://unpkg.com/world-atlas@1.1.4/world/50m.json")
  .then(function(loadedTopoJson) {
    var topology = topojson.presimplify(loadedTopoJson);
    topology = topojson.simplify(topology, 0.005);
    var worldGeoJson = topojson.feature(
      topology,
      topology.objects.land
    );

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 0.15;
    ctx.strokeStyle = "deeppink";
    ctx.fillStyle = "white";

    var clearSmearCounter = 0;

    d3.timer(function(elapsed) {
      clearSmearCounter++;

      if (clearSmearCounter > 200) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        clearSmearCounter = 0;
      }

      projection.rotate([elapsed * 0.004 + 130, 0, 0]);

      ctx.beginPath();
      geoPathGenerator(worldGeoJson);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    });
  });