const merge = (...objects) => {
  const merged = {}
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      merged[key] = obj[key]
    }
  }
  return merged
}

const obj1 = {
  a: 1,
  f: 1,
}

const obj2 = {
  a: 2,
  b: 2,
  g: 2,
}

const obj3 = {
  a: 3,
  g: 3,
  d: 3,
}


console.log(merge(obj1,obj2,obj3))
