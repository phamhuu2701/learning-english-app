export const CATEGORY_SELECTED = {
  get: () => localStorage.getItem('category_selected'),
  set: (value) => {
    localStorage.setItem('category_selected', value)
  },
  delete: () => localStorage.removeItem('category_selected'),
}
