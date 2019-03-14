const prefix = document.querySelector('input')

let currentPrefix = prefix.value

function updatePrefix(event) {
  currentPrefix = event.target.value
  return render(event)
}

prefix.addEventListener('keyup', updatePrefix)
prefix.addEventListener('blur', updatePrefix)
prefix.addEventListener('paste', updatePrefix)

const input = document.querySelector('#input')
const styles = document.querySelector('#workbench')
const output = document.querySelector('#output')

function render(event) {

  styles.textContent = ''
  styles.textContent = input.value

  process(styles.sheet)

  output.value = ''
  for (rule of styles.sheet.cssRules) {
    output.value += rule.cssText + '\n'
  }

  output.value = output.value
    .replace(/ 0px/g, ' 0')
  
  styles.textContent = ''

}

input.addEventListener('keyup', render)
input.addEventListener('blur', render)
input.addEventListener('paste', render)

function process(styles) {
  return readStyles(styles)
}

function readStyles(stylesheet) {
  return Array.from(stylesheet.cssRules).map(rule =>
    readRule(rule)
  )
}

function readRule(rule) {
  return rule.cssRules
  ? readStyles(rule)
  : namespace(rule)
}

function namespace(rule) {
  if (rule.selectorText) {
    return rule.selectorText = 
      rule.selectorText
        .split(',')
        .map(selector => `${selector}.${currentPrefix}, .${currentPrefix} ${selector}`)
        .join(', ')
  }
}