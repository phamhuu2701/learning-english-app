import React, { Component } from 'react'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import default_categories from '../../data/default_categories'
import { CATEGORY_SELECTED } from '../../utils/localStorage'
import './styles.css'

let COUNT = 5

const INTITIAL_STATE = {
  categories: null,
  categorySelected: null,
  confirmChangeCategories: null,
  vocalbularySelected: null,
  formData: { value: '', errMsg: '' },
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = JSON.parse(JSON.stringify(INTITIAL_STATE))
    this.inputRef = React.createRef()
  }

  /**
   *
   * @param {Object} categorySelected
   */
  handleChangeCategory = (categorySelected) => {
    let _items = []
    for (let i = 0, leng = categorySelected.items.length; i < leng; i++) {
      for (let j = 0; j < COUNT; j++) {
        _items.push({
          ...categorySelected.items[(COUNT * i + j) % categorySelected.items.length],
          id: categorySelected.key + '_' + (COUNT * i + j),
        })
      }
    }
    let _categorySelected = {
      ...categorySelected,
      items: _items,
    }

    let random = Math.floor(Math.random() * _categorySelected.items.length)
    let _vocalbularySelected = _categorySelected.items[random]

    this.setState({
      categorySelected: _categorySelected,
      confirmChangeCategories: null,
      vocalbularySelected: _vocalbularySelected,
    })

    CATEGORY_SELECTED.set(JSON.stringify(_categorySelected))
  }

  handleSubmit = () => {
    const { formData, categorySelected, vocalbularySelected } = this.state

    let correctCount = categorySelected.correctCount
    let _items = []
    let _formData = { ...formData }
    let _vocalbularySelected = { ...vocalbularySelected }

    if (vocalbularySelected.en.includes(formData.value.trim().toLowerCase())) {
      correctCount = categorySelected.correctCount + 1

      for (let i = 0; i < categorySelected.items.length; i++) {
        if (categorySelected.items[i].id !== vocalbularySelected.id) {
          _items.push(categorySelected.items[i])
        }
      }

      _formData = { value: '', errMsg: '' }

      let random = Math.floor(Math.random() * categorySelected.items.length)
      _vocalbularySelected = categorySelected.items[random]
    } else {
      _items = [...categorySelected.items]
      _items.push({
        ...vocalbularySelected,
        id: categorySelected.key + '_' + Date.now(),
      })

      let str = ''
      vocalbularySelected.en.forEach((item) => (str += str ? ` or ${item}` : item))
      _formData = { ...formData, errMsg: str }

      console.clear()
      console.table(vocalbularySelected)
      console.table(formData)
    }

    let _categorySelected = {
      ...categorySelected,
      correctCount,
      items: _items,
    }

    this.setState({
      categorySelected: _categorySelected,
      vocalbularySelected: _vocalbularySelected,
      formData: _formData,
    })

    CATEGORY_SELECTED.set(JSON.stringify(_categorySelected))
  }

  handleNextVocabulary = () => {
    const { categorySelected } = this.state

    let random = Math.floor(Math.random() * categorySelected.items.length)
    let _vocalbularySelected = categorySelected.items[random]

    this.setState({
      vocalbularySelected: _vocalbularySelected,
      formData: { value: '', errMsg: '' },
    })
  }

  handleOnKeyDown = (e) => {
    const { formData } = this.state

    if (e.key === 'Enter' && formData.value) {
      if (!formData.errMsg) {
        this.handleSubmit()
      } else {
        this.handleNextVocabulary()
      }
    }
  }

  componentDidMount() {
    let _categories = JSON.parse(JSON.stringify(default_categories))

    let _categorySelected = CATEGORY_SELECTED.get()
    if (_categorySelected) {
      _categorySelected = JSON.parse(_categorySelected)
    } else {
      let _items = []
      for (let i = 0, leng = _categories[0].items.length; i < leng; i++) {
        for (let j = 0; j < COUNT; j++) {
          _items.push({
            ..._categories[0].items[(COUNT * i + j) % _categories[0].items.length],
            id: _categories[0].key + '_' + (COUNT * i + j),
          })
        }
      }
      _categorySelected = {
        ..._categories[0],
        items: _items,
      }

      CATEGORY_SELECTED.set(JSON.stringify(_categorySelected))
    }

    let random = Math.floor(Math.random() * _categorySelected.items.length)
    let vocalbularySelected = _categorySelected.items[random]

    this.setState({
      categories: _categories,
      categorySelected: _categorySelected,
      vocalbularySelected,
    })

    window.addEventListener('keydown', (e) => this.handleOnKeyDown(e))
  }

  componentDidUpdate() {
    this.inputRef.focus()
  }

  render() {
    const {
      categories,
      categorySelected,
      confirmChangeCategories,
      vocalbularySelected,
      formData,
    } = this.state

    let __progress =
      categorySelected?.items?.length > 0
        ? Math.ceil(
            (categorySelected.correctCount /
              (categorySelected.correctCount + categorySelected.items.length)) *
              100
          )
        : 0

    return (
      <div className="Home">
        <div className="header">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {categorySelected ? categorySelected.label : 'Select category'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {categories?.length > 0 &&
                categories.map((item) => (
                  <Dropdown.Item
                    key={item.key}
                    onClick={() =>
                      categorySelected?.key !== item.key
                        ? this.setState({ confirmChangeCategories: item })
                        : null
                    }
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}
              <hr />
              <Dropdown.Item
                onClick={() => {
                  CATEGORY_SELECTED.delete()
                  window.location.reload()
                }}
              >
                RESET DATA
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {categorySelected && (
            <div className="header-total">
              <span className="__total">
                {categorySelected.correctCount}/
                {categorySelected.correctCount + categorySelected.items.length}
              </span>
              <span className="__progress">({__progress}%)</span>
            </div>
          )}
        </div>

        {vocalbularySelected && (
          <div className="body-main">
            {vocalbularySelected.imageUrl && (
              <img alt={vocalbularySelected.en[0]} src={vocalbularySelected.imageUrl} />
            )}

            <p className="caption">
              {JSON.stringify(vocalbularySelected.vi)
                .replace(/"/g, '')
                .replace(/,/g, ', ')
                .replace(/\[/g, '')
                .replace(/]/g, '')}
            </p>

            {formData.errMsg && <div className="error-block">{formData.errMsg}</div>}
          </div>
        )}

        <div className="form-main">
          <Form.Control
            ref={(_ref) => {
              this.inputRef = _ref
            }}
            type="text"
            placeholder="Enter text"
            value={formData.value}
            onChange={(e) =>
              this.setState({
                formData: { value: e.target.value, errMsg: '' },
              })
            }
            // onKeyDown={(e) => (formData.value && e.key === 'Enter' ? this.handleSubmit() : null)}
            disabled={formData.errMsg}
          />
          {formData.errMsg ? (
            <Button
              variant="danger"
              onClick={() => {
                this.handleNextVocabulary()
              }}
            >
              NEXT
            </Button>
          ) : (
            <Button
              variant={formData.value ? 'primary' : 'light'}
              onClick={() => (formData.value ? this.handleSubmit() : null)}
            >
              SUBMIT
            </Button>
          )}
        </div>

        {confirmChangeCategories && (
          <Modal show={true} onHide={() => this.setState({ confirmChangeCategories: null })}>
            <Modal.Header closeButton>
              <Modal.Title>Notifycation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure want to change the category?</p>
              <p>All previous vocabularies will be reset.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.setState({ confirmChangeCategories: null })}
              >
                CANCEL
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  this.handleChangeCategory(confirmChangeCategories)
                }}
              >
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    )
  }
}

export default Home
