var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _React = React,useEffect = _React.useEffect,useRef = _React.useRef,useState = _React.useState;

var useSpeechSynthesis = function useSpeechSynthesis() {var _useState =
  useState([]),_useState2 = _slicedToArray(_useState, 2),voices = _useState2[0],setVoices = _useState2[1];
  var synth = useRef();

  var updateVoices = function updateVoices() {
    setVoices(synth.current.getVoices());
  };

  var speak = function speak(text, voice) {var pitch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;var rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    synth.current.speak(utterance);
  };

  useEffect(function () {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.speechSynthesis) return;
    synth.current = window.speechSynthesis;
    synth.current.onvoiceschanged = updateVoices;
    updateVoices();

    return function () {
      synth.current.onvoiceschanged = null;
    };
  }, []);

  return [
  voices,
  speak];

};

var Bröther = function Bröther() {var _useSpeechSynthesis =
  useSpeechSynthesis(),_useSpeechSynthesis2 = _slicedToArray(_useSpeechSynthesis, 2),voices = _useSpeechSynthesis2[0],speak = _useSpeechSynthesis2[1];var _useState3 =
  useState(),_useState4 = _slicedToArray(_useState3, 2),currentVoice = _useState4[0],setCurrentVoice = _useState4[1];var _useState5 =
  useState('Jesus Christ is Lord'),_useState6 = _slicedToArray(_useState5, 2),text = _useState6[0],setText = _useState6[1];

  useEffect(function () {
    if (!currentVoice) {
      setCurrentVoice(voices.filter(function (v) {return v.default;})[0] || voices[0]);
    }
  }, [voices]);

  var handleVoiceChange = function handleVoiceChange(e) {
    setCurrentVoice(voices.filter(function (v) {return v.name === e.target.value;})[0]);
  };

  var handleTextChange = function handleTextChange(e) {
    setText(e.target.value);
  };

  var handleSpeak = function handleSpeak(e) {
    e.preventDefault();
    speak(text, currentVoice);
  };

  return (
    React.createElement('form', { className: 'contain', onSubmit: handleSpeak },
      React.createElement('div', { className: 'select' },
        React.createElement('select', { value: currentVoice ? currentVoice.name : '', onChange: handleVoiceChange },
          voices.map(function (v) {return (
              React.createElement('option', { value: v.name }, '' + v.name));}))),




      React.createElement('input', { type: 'text', value: text, onChange: handleTextChange }),

      React.createElement('button', { type: 'submit' }, '\uD83D\uDDE3')));


};

var mayIHaveSomeHööks = document.createElement('div');
mayIHaveSomeHööks.id = 'root';
document.body.appendChild(mayIHaveSomeHööks);
ReactDOM.render(React.createElement(Bröther, null), mayIHaveSomeHööks);