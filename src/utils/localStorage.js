export const CATEGORIES = {
  get: () => localStorage.getItem('categories'),
  set: (value) => {
    localStorage.setItem('categories', value)
  },
  delete: () => localStorage.removeItem('categories'),
}

export const CATEGORY_SELECTED = {
  get: () => localStorage.getItem('category_selected'),
  set: (value) => {
    localStorage.setItem('category_selected', value)
  },
  delete: () => localStorage.removeItem('category_selected'),
}
