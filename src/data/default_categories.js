import numbers from './numbers'
import colours from './colours'
import time from './time'
import days_of_the_week from './days_of_the_week'
import months_and_seasons from './months_and_seasons'

const obj = JSON.parse(
  JSON.stringify({
    numbers,
    colours,
    time,
    days_of_the_week,
    months_and_seasons,
  })
)

let keys = Object.keys(obj)

let default_categories = []

keys.forEach((key) => {
  obj[key].forEach((item) => {
    if (item.en.indexOf(',') >= 0) {
      item.en = item.en.split(',').map((text) => (text ? text.toLowerCase().trim() : ''))
    } else {
      item.en = item.en.split('=').map((text) => (text ? text.toLowerCase().trim() : ''))
    }
    if (item.vi.indexOf(',') >= 0) {
      item.vi = item.vi.split(',').map((text) => (text ? text.toLowerCase().trim() : ''))
    } else {
      item.vi = item.vi.split('=').map((text) => (text ? text.toLowerCase().trim() : ''))
    }
  })
})

keys.forEach((key) => {
  default_categories.push({
    key,
    label: key.replace(/_/g, ' ')[0].toUpperCase() + key.replace(/_/g, ' ').slice(1).toLowerCase(),
    items: obj[key],
    correctCount: 0,
  })
})

export default default_categories
