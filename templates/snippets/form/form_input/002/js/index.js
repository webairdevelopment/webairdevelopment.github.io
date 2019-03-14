import computedVariables from 'index.es.js'

// Set --expand to match <textarea>'s scrollHeight
computedVariables(
  '--expand',
  (value, event, tag) => {
    tag.style.height = 'inherit'
    const height = tag.scrollHeight
    tag.style.height = ''
    return height + 'px'
  },
  'textarea',
  ['input', 'paste', 'blur', 'reprocess']
)

// Process variable right away
document.querySelector('textarea').dispatchEvent(new Event('reprocess'))