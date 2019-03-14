;!( function( w, d ) {

    'use strict';

    //                    radius, speed,  opacity
    var Snow = function( x, y, r, sx, sy, o ) {

            this.x = x;
            this.y = y;
            this.r = r;
            this.sx = sx;
            this.sy = sy;
            this.o = o;

            this.draw = function() {

                ctx.beginPath();
                ctx.arc( this.x, this.y, this.r, 0, 2 * Math.PI );
                ctx.fillStyle = 'rgba( 255, 255, 255, ' + this.o + ' )';
                ctx.fill();

            }

            this.update = function() {

                if ( this.x + this.r > cw )
                    this.x = 0;

                if ( this.y + this.r > ch )
                    this.y = 0;

                if ( my && this.y + conf.sense >= my && this.y <= my + conf.sense )
                    this.x += this.sx;

                if ( mx && this.x + conf.sense >= mx && this.x <= mx + conf.sense )
                    this.y += this.sy;

                this.x += this.sx;
                this.y += this.sy;

            }

        },

        anim = t => {

            let l = len;

            ctx.clearRect( 0, 0, cw, ch );

            while ( l-- ) {

                items[ l ].draw();
                items[ l ].update();

            }

            animID = requestAnimationFrame( anim );

        },

        init = () => {

            items = [];
			len = cw > 1000 ? 2000 : cw < 500 ? 500 : 1000;

            for ( let i = 0; i < len; i++ ) {

                let r = Math.round( ( Math.random() * ( conf.maxR - conf.minR ) ) + conf.minR ),
                    x = Math.round( ( Math.random() * ( cw + r ) ) - ( r * 2 ) ),
                    y = Math.round( ( Math.random() * ( ch + r ) ) - ( r * 2 ) ),
                    o = ( Math.random() * ( conf.maxO - conf.minO ) + conf.minO ).toFixed( 2 ),
                    sx = Math.ceil( ( Math.random() * ( conf.maxS - conf.minS ) ) + conf.minS ),
                    sy = Math.ceil( ( Math.random() * ( conf.maxS - conf.minS ) ) + conf.minS );

                items.push( new Snow( x, y, r, sx, sy, o ) );

            }

            animID = requestAnimationFrame( anim );

        },

        c = d.querySelector( 'canvas' ),
        ctx = c.getContext( '2d' ),

        conf = {

            maxR: 1,
            minR: 1,

            maxS: 5,
            minS: 1,

            maxO: 1,
            minO: .3,

            sense: 70

        },

        animID,
        timeoutID,

        mx = false,
        my = false,

        cw = innerWidth,
        ch = innerHeight,

        items = [],
        len = cw > 1000 ? 2000 : cw < 500 ? 500 : 1000;

    c.width = cw;
    c.height = ch;

    w.onresize = e => {

        if ( timeoutID )
            clearTimeout( timeoutID );

        timeoutID = setTimeout( () => {

            cw = innerWidth;
        	ch = innerHeight;

            c.width = cw;
            c.height = ch;

            if ( animID )
                cancelAnimationFrame( animID );

            init();

        }, 250 );

    };

    init();

    w.onmousemove = e => {

        mx = e.x;
        my = e.y;

    }

    w.onmouseout = e => {

        mx = false;
        my = false;

    }

})( this, document );