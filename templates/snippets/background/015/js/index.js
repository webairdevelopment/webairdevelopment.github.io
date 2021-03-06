
body {
overflow: hidden;
margin: 0;
height: 100vh;
perspective: 25em;
background: #ff1ead;
}
div {
transform-style: preserve-3d;
}

.s4hedron {
position: absolute;
top: 50%;
left: 50%;
animation: rot 13.57s linear infinite;
}
.s4hedron__face {
--s: calc(1 - 2*var(--p));
position: absolute;
display: grid;
place-content: start center;
height: calc(var(--n-rows)*8.66025vmin);
transform: translate(-50%, -50%) rotatey(calc(var(--idx)*1turn/var(--n))) rotatex(calc(var(--s)*-35.26439deg)) translatez(calc(var(--n-rows)*1.53093vmin)) scaley(var(--s));
}

@keyframes rot {
0% {
transform: rotatey(1turn);
}
}
.s3gon {
--m: calc(.5*(1 - var(--p0, 1)*var(--p1, 1)));
--p: calc(2*var(--m) - 1);
grid-row: var(--ridx);
grid-column: var(--cidx, var(--n-rows));
position: relative;
margin: calc(-1.08253vmin - (1 - var(--m))*2.16506vmin) -2.45513vmin;
width: 8.66025vmin;
height: 8.66025vmin;
transform: scale(0.95);
}
.s3gon:before, .s3gon:after {
--q: 0;
--s: calc(1 - 2*var(--q));
--ini: rotatey(calc(var(--q)*.5turn));
--dt: calc((var(--cidx)/var(--n-cols)/2 + var(--idx)/var(--n))*-3.91s);
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
backface-visibility: hidden;
background: hsl(0, 0%, calc((1 - var(--q))*100%));
clip-path: polygon(calc(50%*(1 + 0)) calc(50%*(1 + var(--p)*-1)), calc(50%*(1 + 0.86603)) calc(50%*(1 + var(--p)*0.5)), calc(50%*(1 + -0.86603)) calc(50%*(1 + var(--p)*0.5)), calc(50%*(1 + 0)) calc(50%*(1 + var(--p)*-1)), calc(50% + (50% - 50%)*0) calc(50% + (50% - 50%)*var(--p)*-1), calc(50% + (50% - 50%)*-0.86603) calc(50% + (50% - 50%)*var(--p)*0.5), calc(50% + (50% - 50%)*0.86603) calc(50% + (50% - 50%)*var(--p)*0.5), calc(50% + (50% - 50%)*0) calc(50% + (50% - 50%)*var(--p)*-1));
animation: size 3.91s infinite;
animation-name: size, fill, diff, fade;
animation-duration: 3.91s, 3.91s, 6.785s;
animation-delay: var(--dt), var(--dt), calc((var(--idx)/var(--n) - 1 - .5*var(--q))*13.57s);
animation-direction: normal, normal, alternate;
content: "";
}
.s3gon:before {
--q: 1;
}
.s3gon:first-child {
margin-top: 0;
}
.s3gon:nth-child(odd) {
--p1: -1;
}

@keyframes size {
0%, 13% {
transform: var(--ini) scale(0);
}
37%, 100% {
transform: var(--ini) scale(1);
}
}
@keyframes fill {
0%, 63% {
clip-path: polygon(calc(50%*(1 + 0)) calc(50%*(1 + var(--p)*-1)), calc(50%*(1 + 0.86603)) calc(50%*(1 + var(--p)*0.5)), calc(50%*(1 + -0.86603)) calc(50%*(1 + var(--p)*0.5)), calc(50%*(1 + 0)) calc(50%*(1 + var(--p)*-1)), calc(50% + (50% - 50%)*0) calc(50% + (50% - 50%)*var(--p)*-1), calc(50% + (50% - 50%)*-0.86603) calc(50% + (50% - 50%)*var(--p)*0.5), calc(50% + (50% - 50%)*0.86603) calc(50% + (50% - 50%)*var(--p)*0.5), calc(50% + (50% - 50%)*0) calc(50% + (50% - 50%)*var(--p)*-1));
}
87%, 100% {
clip-path: polygon(calc(50%*(1 + 0)) calc(50%*(1 + var(--p)*-1)), calc(50%*(1 + 0.86603)) calc(50%*(1 + var(--p)*0.5)), calc(50%*(1 + -0.86603)) calc(50%*(1 + var(--p)*0.5)), calc(50%*(1 + 0)) calc(50%*(1 + var(--p)*-1)), calc(50% + (50% - 0px)*0) calc(50% + (50% - 0px)*var(--p)*-1), calc(50% + (50% - 0px)*-0.86603) calc(50% + (50% - 0px)*var(--p)*0.5), calc(50% + (50% - 0px)*0.86603) calc(50% + (50% - 0px)*var(--p)*0.5), calc(50% + (50% - 0px)*0) calc(50% + (50% - 0px)*var(--p)*-1));
}
}
@keyframes fade {
0%, 74% {
opacity: 0.99;
}
87%, 100% {
opacity: 0.01;
}
}
@keyframes diff {
to {
background: hsl(0, 0%, calc((1 - var(--q))*100% - var(--s)*39%));
}
}
