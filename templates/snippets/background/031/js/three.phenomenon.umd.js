﻿!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):e.Phenomenon=r()}(this,function(){var e=function(e){function r(r){e.call(this);var t=r.geometry,a=r.multiplier,n=r.attributes,o=t.vertices.length,i=3*t.faces.length,f=[];t.faces.map(function(e){return f.push(e.a,e.b,e.c)});for(var s=new Uint32Array(a*i),u=0;u<a;u+=1)for(var c=0;c<i;c+=1)s[u*i+c]=f[c]+u*o;this.setIndex(new THREE.BufferAttribute(s,1));var m=new THREE.BufferAttribute(new Float32Array(a*o*3),3);this.addAttribute("position",m);for(var d=0,h=0;h<a;h+=1)for(var v=0;v<o;v+=1,d+=3){var l=t.vertices[v];m.array[d]=l.x,m.array[d+1]=l.y,m.array[d+2]=l.z}for(var p=0;p<n.length;p+=1){var y=new Float32Array(a*o*n[p].size),E=new THREE.BufferAttribute(y,n[p].size);this.addAttribute(n[p].name,E);for(var S=0;S<a;S+=1){var x=n[p].data(S,a);d=S*o*E.itemSize;for(var b=0;b<o;b+=1)for(var g=0;g<E.itemSize;g+=1)E.array[d]=x[g],d+=1}}return this}return e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r,r}(THREE.BufferGeometry),r=function(r){var t=r.material,a=r.uniforms,n=r.vertex,o=r.castShadow;void 0===o&&(o=!1);var i=new e(r),f=new THREE.Mesh(i,t);return f.geometry.computeVertexNormals(),t.onBeforeCompile=function(e){Object.assign(e.uniforms,a);var r=n.replace(/(\r\n|\n|\r)/gm,""),i=r.match(/.+?(?=void)/)[0],s=r.match(/main\(\){(.*?)}/)[1];if(e.vertexShader=i+" \n "+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",s.replace("gl_Position =","vec3 transformed =")),t.onBeforeCompile=t.onBeforeCompile.toString().slice(0,-1)+"/* "+Math.random()+" */}",o){var u=new THREE.ShaderMaterial({vertexShader:e.vertexShader,fragmentShader:THREE.ShaderLib.shadow.fragmentShader,uniforms:a});f.castShadow=!0,f.customDepthMaterial=u,f.customDistanceMaterial=u}},{mesh:f,uniforms:a}};return THREE.Phenomenon=r,r});
