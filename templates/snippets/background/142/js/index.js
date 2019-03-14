const vertexShaderSource = `#version 300 es

    uniform float u_time;
    uniform float u_timeOffset;

    in vec2 a_position;

    ${document.getElementById('shader-snoise2d').textContent}
    
    void main () {
        float noise = snoise(a_position * 0.5 + u_time * 0.5) * u_timeOffset;
        gl_Position = vec4(a_position + noise, 0.0, 1.0);
        gl_PointSize = noise * 3.0;
    }
`

const fragmentShaderSource = `#version 300 es
    precision mediump float;

    out vec4 outColor;

    void main() {
        outColor = vec4(1.0);
    }
`


const webglUtils = {

    makeShader (gl, type, source) {
        let shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            let shaderType = type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT'
            console.error(
                `Error compiling ${shaderType} shader: 
                ${gl.getShaderInfoLog(shader)}`
            )
            gl.deleteShader(shader)

            return
        }

        return shader
    },
    
    makeProgram (gl, vertexShader, fragmentShader, doValidate = false) {
        let program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`)
            gl.deleteProgram(program)
            return
        }

        if (doValidate) {
            gl.validateProgram(program)
            if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                console.error(`Error validating program ${gl.getProgramInfoLog(program)}`)
                gl.deleteProgram(program)
                return
            }
        }

        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)

        return program
    },
    
    makeBuffer (gl, { bufferType, typedArray, drawType }) {
        const buffer = gl.createBuffer()
        gl.bindBuffer(bufferType, buffer)
        gl.bufferData(bufferType, typedArray, drawType)
        // gl.bindBuffer(bufferType, null)

        buffer.typedArray = typedArray

        return buffer
    },

    bindBuffer (gl, buffer, { bufferType, attribLocation, attribType, itemsPerVert }) {
        gl.bindBuffer(bufferType, buffer)
        if (!buffer) return
        gl.enableVertexAttribArray(attribLocation)
        gl.vertexAttribPointer(attribLocation, itemsPerVert, attribType, false, 0, 0)
        gl.bindBuffer(bufferType, null)
    },
    
    makeVAO (gl, attribs) {
        const rtn = {
            buffers: [],
            vao: gl.createVertexArray()
        }
        
        gl.bindVertexArray(rtn.vao)
    
        rtn.buffers = attribs.map(attrib => {
            const buffer = this.makeBuffer(gl, attrib)
            if (attrib.bufferType !== gl.ELEMENT_ARRAY_BUFFER) {
                this.bindBuffer(gl, buffer, attrib)
            }
            return buffer
        })

        gl.bindVertexArray(null)

        return rtn

    }

}

class Costellation {
    constructor ({ numPoints, vShaderSource, fShaderSource }) {
        this._numPoints = numPoints
        this._vShaderSource = vShaderSource
        this._fShaderSource = fShaderSource
        this._uniformLocations = {}

        this._targetTimeOffset = 1
        this._timeOffset = 1
        
        this._gl = null
        this._program = null
        this._rtn = null
    }

    _setupVAO () {
        const { _gl: gl } = this
        const positions = new Float32Array(this._numPoints * 2)
        
        for (let i = 0; i < this._numPoints; i += 1) {
            positions[i * 2 + 0] = Math.random() * 2 - 1
            positions[i * 2 + 1] = Math.random() * 2 - 1
        }
        
        const attribs = [
            {
                bufferType: gl.ARRAY_BUFFER,
                typedArray: positions,
                drawType: gl.STATIC_DRAW,
                attribType: gl.FLOAT,
                itemsPerVert: 2,
                attribLocation: gl.getAttribLocation(this._program, 'a_position')
            }
        ]

        this._rtn = webglUtils.makeVAO(gl, attribs)
    }

    _setupUniforms () {
        const { _gl: gl } = this
        gl.useProgram(this._program)
        this._uniformLocations['u_time'] = gl.getUniformLocation(this._program, 'u_time')
        this._uniformLocations['u_timeOffset'] = gl.getUniformLocation(this._program, 'u_timeOffset')
        gl.useProgram(null)
    }

    init (gl) {
        this._gl = gl

        const vertexShader = webglUtils.makeShader(gl, gl.VERTEX_SHADER, this._vShaderSource)
        const fragmentShader = webglUtils.makeShader(gl, gl.FRAGMENT_SHADER, this._fShaderSource)
        this._program = webglUtils.makeProgram(gl, vertexShader, fragmentShader)
        
        this._setupVAO()
        this._setupUniforms()

        const timeOffsetInterval = setInterval(() => {
            this._targetTimeOffset = (Math.random() * 2 - 1) * 2
        }, 3000)

        return this
    }

    renderFrame (dt, now) {
        const { _gl: gl } = this

        this._timeOffset += (this._targetTimeOffset - this._timeOffset) * (dt * 2.25)

        gl.useProgram(this._program)

        gl.uniform1f(this._uniformLocations['u_time'], now)
        gl.uniform1f(this._uniformLocations['u_timeOffset'], this._timeOffset)

        gl.bindVertexArray(this._rtn.vao)
        gl.drawArrays(0, 0, this._numPoints)
        gl.bindVertexArray(null)
        gl.useProgram(null)
    }
}

const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2')
const dpr = window.devicePixelRatio || 1

const costellation = new Costellation({
    numPoints: 100000,
    vShaderSource: vertexShaderSource,
    fShaderSource: fragmentShaderSource
}).init(gl)

let oldTimeMs = 0

const renderFrame = () => {
    window.requestAnimationFrame(renderFrame)
    
    const currentTimeMs = window.performance.now() / 1000
    const dt = currentTimeMs - oldTimeMs
    oldTimeMs = currentTimeMs
    
    gl.viewport(0, 0, window.innerWidth * dpr, window.innerHeight * dpr)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    costellation.renderFrame(dt, currentTimeMs)
}

const init = () => {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    document.body.appendChild(canvas)
}

const checkForWebGL2 = () => {
  if (!gl) {
    const msg = document.createElement('div')
    msg.style.position = 'fixed'
    msg.style.top = msg.style.right = msg.style.left = msg.style.bottom = '0px'
    msg.style.zIndex = 9999
    msg.style.backgroundColor = '#000'
    msg.style.color = '#fff'
    msg.style.padding = '1rem'
    msg.innerHTML = `
      Your browser does not support WebGL2.0 <br/>
      Please upgrade to modern Chrome or Firefox.
    `
    document.body.appendChild(msg)
  }
}

window.onload = () => {
    checkForWebGL2()
    init()
    renderFrame()
}