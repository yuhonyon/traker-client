import trackEvent from '../index'
import { notChanged, isEmpty } from './utils'

export default function (el, binding) {
  if (notChanged(binding) || isEmpty(binding)) {
    return
  }

  let args = []
  let events = Object.keys(binding.modifiers).map(modifier => {
    if (binding.modifiers[modifier]) {
      return modifier
    }
  })

  if (typeof binding.value === 'object') {
    let value = binding.value
    if (value.category) args.push(value.category)
    if (value.action) args.push(value.action)
    if (value.desc) args.push(value.desc)
    if (value.value) args.push(value.value)
  } else if (typeof binding.value === 'string') {
    args = binding.value.split(',')
    args.forEach((arg, i) => (args[i] = arg.trim()))
  }

  if (!events.length) events.push('click') // default  listen click

  events.forEach((event) => {
    el.addEventListener(event, () => trackEvent(...args), false)
  })
}
