import React, { Component } from 'react'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import default_categories from '../../data/default_categories'
import { CATEGORY_SELECTED } from '../../utils/localStorage'
import './styles.css'

const REPEAT_COUNT = 0

const INTITIAL_STATE = {
  categorySelected: null,
  vocalbularySelected: null,
  formData: { value: '', errMsg: '' },
  confirmChangeCategories: null,
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
    let _categorySelected = categorySelected
    _categorySelected.items.forEach(item => item.id = _categorySelected.key + '_' + item.en[0].replace('/ /g', '_') + '_' + Date.now())
    for (let i=0; i<REPEAT_COUNT; i++){
      _categorySelected.items = [..._categorySelected.items, ..._categorySelected.items]
    }

    let random = Math.floor(Math.random() * _categorySelected.items.length)
    let _vocalbularySelected = _categorySelected.items[random]

    this.setState({
      categorySelected: _categorySelected,
      vocalbularySelected: _vocalbularySelected,
      formData: { value: '', errMsg: '' },
      confirmChangeCategories: null
    })

    CATEGORY_SELECTED.set(JSON.stringify(_categorySelected))
  }

  handleSubmit = () => {
    const { categorySelected, vocalbularySelected, formData } = this.state

    let _categorySelected = JSON.parse(JSON.stringify(categorySelected))
    let _vocalbularySelected = JSON.parse(JSON.stringify(vocalbularySelected))
    let _formData = JSON.parse(JSON.stringify(formData))

    if (_vocalbularySelected.en.includes(_formData.value.trim().toLowerCase())) {
      _categorySelected.correctCount = _categorySelected.correctCount + 1

      let _items = []
      for (let i = 0; i < _categorySelected.items.length; i++) {
        if (_categorySelected.items[i].id !== _vocalbularySelected.id) {
          _items.push(_categorySelected.items[i])
        }
      }
      _categorySelected.items = _items

      let random = Math.floor(Math.random() * _categorySelected.items.length)
      _vocalbularySelected = _categorySelected.items[random]

      _formData = { value: '', errMsg: '' }
    } else {
      _categorySelected.items.push({
        ..._vocalbularySelected,
        id: _categorySelected.key + '_' + _vocalbularySelected.en[0].replace('/ /g', '_') + '_' + Date.now()
      })

      let str = ''
      _vocalbularySelected.en.forEach((item) => (str += str ? ` or ${item}` : item))
      _formData = { ..._formData, errMsg: str }
    }

    this.setState({
      categorySelected: _categorySelected,
      vocalbularySelected: _vocalbularySelected,
      formData: _formData,
    })

    CATEGORY_SELECTED.set(JSON.stringify(_categorySelected))
  }

  handleNextVocabulary = () => {
    let _categorySelected = CATEGORY_SELECTED.get()
    _categorySelected = JSON.parse(_categorySelected)

    let random = Math.floor(Math.random() * _categorySelected.items.length)
    let _vocalbularySelected = _categorySelected.items[random]

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
      _categorySelected = _categories[0]
      _categorySelected.items.forEach(item => item.id = _categorySelected.key + '_' + item.en[0].replace('/ /g', '_') + '_' + Date.now())
      for (let i=0; i<REPEAT_COUNT; i++){
        _categorySelected.items = [..._categorySelected.items, ..._categorySelected.items]
      }

      CATEGORY_SELECTED.set(JSON.stringify(_categorySelected))
    }
    
    let random = Math.floor(Math.random() * _categorySelected.items.length)
    let _vocalbularySelected = _categorySelected.items[random]

    this.setState({
      categorySelected: _categorySelected,
      vocalbularySelected: _vocalbularySelected,
    })

    window.addEventListener('keydown', (e) => this.handleOnKeyDown(e))
  }

  componentDidUpdate() {
    this.inputRef?.focus?.()
  }

  render() {
    const {
      categorySelected,
      vocalbularySelected,
      formData,
      confirmChangeCategories,
    } = this.state

    let progress =
      categorySelected?.items?.length > 0
        ? Math.ceil((categorySelected.correctCount / (categorySelected.correctCount + categorySelected.items.length)) * 100)
        : 100

    return (
      <div className="Home">
        <div className="header">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {categorySelected ? categorySelected.label : 'Select category'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {default_categories.map((item) => (
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
            <div>
              <span>
                {categorySelected.correctCount}/{categorySelected.correctCount + categorySelected.items.length}
              </span>
              <span style={{marginLeft: 10}}>({progress}%)</span>
            </div>
          )}
        </div>

        {vocalbularySelected && categorySelected?.items.length > 0 && (
          <div className="body-main">
            <div className="body-main-item">
              <div className="caption">
                {JSON.stringify(vocalbularySelected.vi)
                  .replace(/"/g, '')
                  .replace(/,/g, ', ')
                  .replace(/\[/g, '')
                  .replace(/]/g, '')}
              </div>
            </div>

            <div className="body-main-item">
              {formData.errMsg && <div className="error-block">{formData.errMsg}</div>}
            </div>
          </div>
        )}

        {categorySelected?.items?.length === 0 && (
          <div className="body-main">
            <div className="body-main-item">
              <div className="caption caption-small">
                You have completed this category
              </div>
            </div>
          </div>
        )}

        {categorySelected?.items?.length > 0 && (
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
              disabled={formData.errMsg || categorySelected?.items.length === 0}
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
        )}

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
