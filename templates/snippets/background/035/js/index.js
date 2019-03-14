class Snow
{
    constructor() {

        this.imageInfo        = 0;
        this.snowFlakeEntropy = 100;
        this.flakeCount       = 3000;

        this.snowColor        = (v) => { return `hsl(0, 0%, ${50 + v * 40 | 0}%)`; };

        this.canvas = document.querySelector('canvas');
        this.engine = this.canvas.getContext('2d');

        this.width  = window.innerWidth;
        this.height = window.innerHeight;

        this.minSize = 15;
        this.maxSize = Math.max(5, this.width * 0.15 + this.height * 0.15);

        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);

        this.generateImages();
        this.renderer = null;

        this.build();
        this.buildBackground();
        this.buildForeground();

    }

    buildBackground() {

        this.bg = this.engine.createLinearGradient(0,0,0,this.height);
        this.bg.addColorStop(0, '#115');
        this.bg.addColorStop(1, '#55a');

    }

    buildForeground() {

        this.fg = this.engine.createLinearGradient(0,0,0,this.height);
        this.fg.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        this.fg.addColorStop(1, 'rgba(0, 0, 0, 0)');

    }

    generateImages() {

        this.flakeImages = new Array(this.snowFlakeEntropy);

        for (let i = 0; i < this.snowFlakeEntropy; i++) {
            this.flakeImages[i] = this.generateRandomFlake(i / this.snowFlakeEntropy);
        }

        console.log(`unique flakes builded: ${this.imageInfo}`);

    }

    build() {

        this.flakeStorage = new Array(this.flakeCount).fill(null).map(() => {

            const flake = {
                img : this.flakeImages[Math.random() * this.flakeImages.length | 0]
            };

            this.resetFlake(flake);
            flake.y = Math.random();

            return flake;

        });

        this.flakeStorage.sort((f1, f2) => {
            return f1.img.imgSize - f2.img.imgSize;
        });


    }

    resetFlake(flake) {

        flake.x  = Math.random();
        flake.y  = 0;
        flake.dx = Math.random();
        flake.dy = Math.random();

        flake.current = flake.img.samples[flake.img.samples.length * Math.random() | 0];

    }


    generateRandomFlake(s) {

        const sizer   = Math.pow(s, 15);
        const sCount  = 1 + Math.pow(s, 15) * 6 | 0;
        // const sizer = Math.pow(s, 5);

        const size    = this.minSize + sizer * this.maxSize;
        const radius  = size * 0.45;
        const imgSize = size * 1.4;

        const samples = new Array(sCount);

        for (let s = 0; s < sCount; s++) {

            this.imageInfo++;

            const blur    = Math.pow(size * 0.05, 1.05) * (Math.random() + 0.5) | 0;
            const mid     = imgSize / 2;
            const spread  = 0.2 + Math.random() * 0.35;

            const lineWidth  = size * 0.05;
            const beginAngle = Math.random() * Math.PI * 2;
            const forkCount  = 5 + Math.random() * 5 | 0;

            const canvas = document.createElement('canvas');
            const engine = canvas.getContext('2d');

            canvas.setAttribute('width', imgSize);
            canvas.setAttribute('height', imgSize);

            engine.lineCap     = 'round';
            engine.filter      = `blur(${blur}px)`;
            engine.strokeStyle = this.snowColor(sizer);


            //main
            engine.beginPath();

            for (let i = 0; i < forkCount; i++) {

                engine.moveTo(mid, mid);
                engine.lineTo(
                    mid + Math.cos(beginAngle + i / forkCount * Math.PI * 2) * radius * 0.7,
                    mid + Math.sin(beginAngle + i / forkCount * Math.PI * 2) * radius * 0.7
                );

            }

            engine.lineWidth = lineWidth * (Math.random() + 0.1);
            engine.stroke();
            engine.closePath();

            //sub
            engine.beginPath();

            for (let i = 0; i < forkCount; i++) {

                const depth = 0.3 * radius + 0.3 * Math.random() * radius;

                const left  = depth + radius * 0.3 + radius * 0.4 * Math.random();
                const right = depth + radius * 0.3 + radius * 0.4 * Math.random();

                engine.moveTo(
                    mid + Math.cos(beginAngle + i / forkCount * Math.PI * 2 - spread) * (left),
                    mid + Math.sin(beginAngle + i / forkCount * Math.PI * 2 - spread) * (left)
                );
                engine.lineTo(
                    mid + Math.cos(beginAngle + i / forkCount * Math.PI * 2) * depth,
                    mid + Math.sin(beginAngle + i / forkCount * Math.PI * 2) * depth
                );
                engine.lineTo(
                    mid + Math.cos(beginAngle + i / forkCount * Math.PI * 2 + spread) * (right),
                    mid + Math.sin(beginAngle + i / forkCount * Math.PI * 2 + spread) * (right)
                );

            }

            engine.lineWidth   = lineWidth * 0.5 * (Math.random() + 0.1);
            engine.strokeStyle = this.snowColor(sizer);
            engine.stroke();
            engine.closePath();

            samples[s] = canvas;

        }

        return {
            imgSize,
            samples
        }

    }

    progress(from, to, step) {
        return from + (to - from) * step;
    }

    renderFlake(flake) {

        flake.x += 0.0003 + flake.dx * 0.0003 * Math.pow(flake.img.imgSize * 0.03, 1.05);
        flake.y += (0.003  + flake.dy * 0.015) * Math.pow(flake.img.imgSize * 0.003, 0.7);

        (flake.y > 1 || flake.y < 0) && this.resetFlake(flake);

        this.engine.drawImage(
            flake.current,
            this.progress(-flake.img.imgSize, this.width, flake.x % 1) | 0,
            this.progress(-flake.img.imgSize, this.height, flake.y) | 0,
        );

    }

    render() {

        this.engine.fillStyle = this.bg;
        this.engine.fillRect(0, 0, this.width, this.height);

        this.flakeStorage.forEach(this.renderFlake.bind(this));

        this.engine.fillStyle = this.fg;
        this.engine.fillRect(0, 0, this.width, this.height);

        requestAnimationFrame(this.renderer);

    }

    run() {

        this.renderer = this.render.bind(this);
        this.renderer();

    }
}

const a = new Snow();
a.run();