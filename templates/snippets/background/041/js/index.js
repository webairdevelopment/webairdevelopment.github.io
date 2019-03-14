const bird = `
  <div class="bird"> 
    <svg class="body" viewBox="0 0 186 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M141.252 60H36.0012L39 89C39 89 83.6144 126.4 116.192 107.826C148.769 89.2529 141.252 60 141.252 60Z" fill="#444"></path>
      <path d="M125.017 71.9999L178.001 77.0863L123.001 92.9948L125.017 71.9999Z" fill="#FF8600"></path><rect x="2.0011" y="65.9999" width="68" height="11" fill="#777"></rect>
      <rect x="2.94153" y="82.2459" width="66.5697" height="11" transform="rotate(-13.2396 2.94153 82.2459)" fill="#777"></rect>
      <path class="wing" d="M34.6539 0.691315L116.039 65.1827L82.179 107.913L34.6539 0.691315Z" fill="#999"></path>
    </svg>
  </div>`;

const birds_container = document.querySelector(".birds");
let string = "";

for (let i = 0; i < 20; ++i) {
  string += bird;
}

birds_container.innerHTML = string;
const birds = document.querySelectorAll(".bird");

birds.forEach((bird, index) => {
  bird.style.animationDelay = `${Math.random() * 10 * Math.sqrt(index)}s`;
  bird.querySelector(".body").style.animationDelay = `${Math.random() * 3}s`;
});