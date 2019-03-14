!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e.one=e.one||{},e.one.color=t())}(this,function(){"use strict";function e(t){if(Array.isArray(t)){if("string"==typeof t[0]&&"function"==typeof e[t[0]])return new e[t[0]](t.slice(1,t.length));if(4===t.length)return new e.RGB(t[0]/255,t[1]/255,t[2]/255,t[3]/255)}else if("string"==typeof t){var r=t.toLowerCase();e.namedColors[r]&&(t="#"+e.namedColors[r]),"transparent"===r&&(t="rgba(0,0,0,0)");var o=t.match(i);if(o){var s=o[1].toUpperCase(),f=a(o[8])?o[8]:parseFloat(o[8]),u="H"===s[0],l=o[3]?100:u?360:255,h=o[5]||u?100:255,c=o[7]||u?100:255;if(a(e[s]))throw new Error("color."+s+" is not installed.");return new e[s](parseFloat(o[2])/l,parseFloat(o[4])/h,parseFloat(o[6])/c,f)}t.length<6&&(t=t.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,"$1$1$2$2$3$3"));var d=t.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);if(d)return new e.RGB(parseInt(d[1],16)/255,parseInt(d[2],16)/255,parseInt(d[3],16)/255);if(e.CMYK){var b=t.match(new RegExp("^cmyk\\("+n.source+","+n.source+","+n.source+","+n.source+"\\)$","i"));if(b)return new e.CMYK(parseFloat(b[1])/100,parseFloat(b[2])/100,parseFloat(b[3])/100,parseFloat(b[4])/100)}}else if("object"==typeof t&&t.isColor)return t;return!1}var t=[],a=function(e){return void 0===e},r=/\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,n=/\s*(\.\d+|100|\d?\d(?:\.\d+)?)%\s*/,i=new RegExp("^(rgb|hsl|hsv)a?\\("+r.source+","+r.source+","+r.source+"(?:,"+/\s*(\.\d+|\d+(?:\.\d+)?)\s*/.source+")?\\)$","i");e.namedColors={},e.installColorSpace=function(r,n,i){function o(t,a){var r={};r[a.toLowerCase()]=function(){return this.rgb()[a.toLowerCase()]()},e[a].propertyNames.forEach(function(e){var t="black"===e?"k":e.charAt(0);r[e]=r[t]=function(t,r){return this[a.toLowerCase()]()[e](t,r)}});for(var n in r)r.hasOwnProperty(n)&&void 0===e[t].prototype[n]&&(e[t].prototype[n]=r[n])}e[r]=function(e){var t=Array.isArray(e)?e:arguments;n.forEach(function(e,a){var i=t[a];if("alpha"===e)this._alpha=isNaN(i)||i>1?1:i<0?0:i;else{if(isNaN(i))throw new Error("["+r+"]: Invalid color: ("+n.join(",")+")");"hue"===e?this._hue=i<0?i-Math.floor(i):i%1:this["_"+e]=i<0?0:i>1?1:i}},this)},e[r].propertyNames=n;var s=e[r].prototype;["valueOf","hex","hexa","css","cssa"].forEach(function(e){s[e]=s[e]||("RGB"===r?s.hex:function(){return this.rgb()[e]()})}),s.isColor=!0,s.equals=function(e,t){a(t)&&(t=1e-10),e=e[r.toLowerCase()]();for(var i=0;i<n.length;i+=1)if(Math.abs(this["_"+n[i]]-e["_"+n[i]])>t)return!1;return!0},s.toJSON=function(){return[r].concat(n.map(function(e){return this["_"+e]},this))};for(var f in i)if(i.hasOwnProperty(f)){var u=f.match(/^from(.*)$/);u?e[u[1].toUpperCase()].prototype[r.toLowerCase()]=i[f]:s[f]=i[f]}return s[r.toLowerCase()]=function(){return this},s.toString=function(){return"["+r+" "+n.map(function(e){return this["_"+e]},this).join(", ")+"]"},n.forEach(function(e){var t="black"===e?"k":e.charAt(0);s[e]=s[t]=function(t,a){return void 0===t?this["_"+e]:a?new this.constructor(n.map(function(a){return this["_"+a]+(e===a?t:0)},this)):new this.constructor(n.map(function(a){return e===a?t:this["_"+a]},this))}}),t.forEach(function(e){o(r,e),o(e,r)}),t.push(r),e},e.pluginList=[],e.use=function(t){return-1===e.pluginList.indexOf(t)&&(this.pluginList.push(t),t(e)),e},e.installMethod=function(a,r){return t.forEach(function(t){e[t].prototype[a]=r}),this},e.installColorSpace("RGB",["red","green","blue","alpha"],{hex:function(){var e=(65536*Math.round(255*this._red)+256*Math.round(255*this._green)+Math.round(255*this._blue)).toString(16);return"#"+"00000".substr(0,6-e.length)+e},hexa:function(){var e=Math.round(255*this._alpha).toString(16);return"#"+"00".substr(0,2-e.length)+e+this.hex().substr(1,6)},css:function(){return"rgb("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+")"},cssa:function(){return"rgba("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+","+this._alpha+")"}});var o=e,s=function(e){e.installColorSpace("XYZ",["x","y","z","alpha"],{fromRgb:function(){var t=function(e){return e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92},a=t(this._red),r=t(this._green),n=t(this._blue);return new e.XYZ(.4124564*a+.3575761*r+.1804375*n,.2126729*a+.7151522*r+.072175*n,.0193339*a+.119192*r+.9503041*n,this._alpha)},rgb:function(){var t=this._x,a=this._y,r=this._z,n=function(e){return e>.0031308?1.055*Math.pow(e,1/2.4)-.055:12.92*e};return new e.RGB(n(3.2404542*t+-1.5371385*a+-.4985314*r),n(-.969266*t+1.8760108*a+.041556*r),n(.0556434*t+-.2040259*a+1.0572252*r),this._alpha)},lab:function(){var t=function(e){return e>.008856?Math.pow(e,1/3):7.787037*e+4/29},a=t(this._x/95.047),r=t(this._y/100),n=t(this._z/108.883);return new e.LAB(116*r-16,500*(a-r),200*(r-n),this._alpha)}})},f=function(e){e.use(s),e.installColorSpace("LAB",["l","a","b","alpha"],{fromRgb:function(){return this.xyz().lab()},rgb:function(){return this.xyz().rgb()},xyz:function(){var t=function(e){var t=Math.pow(e,3);return t>.008856?t:(e-16/116)/7.87},a=(this._l+16)/116,r=this._a/500+a,n=a-this._b/200;return new e.XYZ(95.047*t(r),100*t(a),108.883*t(n),this._alpha)}})},u=function(e){e.installColorSpace("HSV",["hue","saturation","value","alpha"],{rgb:function(){var t,a,r,n=this._hue,i=this._saturation,o=this._value,s=Math.min(5,Math.floor(6*n)),f=6*n-s,u=o*(1-i),l=o*(1-f*i),h=o*(1-(1-f)*i);switch(s){case 0:t=o,a=h,r=u;break;case 1:t=l,a=o,r=u;break;case 2:t=u,a=o,r=h;break;case 3:t=u,a=l,r=o;break;case 4:t=h,a=u,r=o;break;case 5:t=o,a=u,r=l}return new e.RGB(t,a,r,this._alpha)},hsl:function(){var t,a=(2-this._saturation)*this._value,r=this._saturation*this._value,n=a<=1?a:2-a;return t=n<1e-9?0:r/n,new e.HSL(this._hue,t,a/2,this._alpha)},fromRgb:function(){var t,a=this._red,r=this._green,n=this._blue,i=Math.max(a,r,n),o=Math.min(a,r,n),s=i-o,f=0===i?0:s/i,u=i;if(0===s)t=0;else switch(i){case a:t=(r-n)/s/6+(r<n?1:0);break;case r:t=(n-a)/s/6+1/3;break;case n:t=(a-r)/s/6+2/3}return new e.HSV(t,f,u,this._alpha)}})},l=function(e){e.use(u),e.installColorSpace("HSL",["hue","saturation","lightness","alpha"],{hsv:function(){var t,a=2*this._lightness,r=this._saturation*(a<=1?a:2-a);return t=a+r<1e-9?0:2*r/(a+r),new e.HSV(this._hue,t,(a+r)/2,this._alpha)},rgb:function(){return this.hsv().rgb()},fromRgb:function(){return this.hsv().hsl()}})},h=function(e){e.installColorSpace("CMYK",["cyan","magenta","yellow","black","alpha"],{rgb:function(){return new e.RGB(1-this._cyan*(1-this._black)-this._black,1-this._magenta*(1-this._black)-this._black,1-this._yellow*(1-this._black)-this._black,this._alpha)},fromRgb:function(){var t=this._red,a=this._green,r=this._blue,n=1-t,i=1-a,o=1-r,s=1;return t||a||r?(s=Math.min(n,Math.min(i,o)),n=(n-s)/(1-s),i=(i-s)/(1-s),o=(o-s)/(1-s)):s=1,new e.CMYK(n,i,o,s,this._alpha)}})},c=function(e){e.namedColors={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgrey:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",grey:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"}},d=function(e){e.installMethod("clearer",function(e){return this.alpha(isNaN(e)?-.1:-e,!0)})},b=function(e){function t(e){return e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4)}e.installMethod("luminance",function(){var e=this.rgb();return.2126*t(e._red)+.7152*t(e._green)+.0722*t(e._blue)})},g=function(e){e.use(b),e.installMethod("contrast",function(e){var t=this.luminance(),a=e.luminance();return t>a?(t+.05)/(a+.05):(a+.05)/(t+.05)})},p=function(e){e.use(l),e.installMethod("darken",function(e){return this.lightness(isNaN(e)?-.1:-e,!0)})},_=function(e){e.use(l),e.installMethod("desaturate",function(e){return this.saturation(isNaN(e)?-.1:-e,!0)})},m=function(e){function t(){var t=this.rgb(),a=.3*t._red+.59*t._green+.11*t._blue;return new e.RGB(a,a,a,t._alpha)}e.installMethod("greyscale",t).installMethod("grayscale",t)},w=function(e){e.installMethod("isDark",function(){var e=this.rgb();return(255*e._red*299+255*e._green*587+255*e._blue*114)/1e3<128})},y=function(e){e.use(w),e.installMethod("isLight",function(){return!this.isDark()})},v=function(e){e.use(l),e.installMethod("lighten",function(e){return this.lightness(isNaN(e)?.1:e,!0)})},k=function(e){e.installMethod("mix",function(t,a){t=e(t).rgb(),a=1-(isNaN(a)?.5:a);var r=2*a-1,n=this._alpha-t._alpha,i=((r*n==-1?r:(r+n)/(1+r*n))+1)/2,o=1-i,s=this.rgb();return new e.RGB(s._red*i+t._red*o,s._green*i+t._green*o,s._blue*i+t._blue*o,s._alpha*a+t._alpha*(1-a))})},M=function(e){e.installMethod("negate",function(){var t=this.rgb();return new e.RGB(1-t._red,1-t._green,1-t._blue,this._alpha)})},C=function(e){e.installMethod("opaquer",function(e){return this.alpha(isNaN(e)?.1:e,!0)})},N=function(e){e.use(l),e.installMethod("rotate",function(e){return this.hue((e||0)/360,!0)})},x=function(e){e.use(l),e.installMethod("saturate",function(e){return this.saturation(isNaN(e)?.1:e,!0)})},R=function(e){e.installMethod("toAlpha",function(e){var t=this.rgb(),a=e(e).rgb(),r=new e.RGB(0,0,0,t._alpha),n=["_red","_green","_blue"];return n.forEach(function(e){t[e]<1e-10?r[e]=t[e]:t[e]>a[e]?r[e]=(t[e]-a[e])/(1-a[e]):t[e]>a[e]?r[e]=(a[e]-t[e])/a[e]:r[e]=0}),r._red>r._green?r._red>r._blue?t._alpha=r._red:t._alpha=r._blue:r._green>r._blue?t._alpha=r._green:t._alpha=r._blue,t._alpha<1e-10?t:(n.forEach(function(e){t[e]=(t[e]-a[e])/t._alpha+a[e]}),t._alpha*=r._alpha,t)})};return o.use(s).use(f).use(u).use(l).use(h).use(c).use(d).use(g).use(p).use(_).use(m).use(w).use(y).use(v).use(b).use(k).use(M).use(C).use(N).use(x).use(R)});
