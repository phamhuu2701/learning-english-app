import React, { Component } from 'react'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import default_data from '../../db/default_data'
import data from '../../db/default_data'
import categories from '../../db/default_data'
import './styles.css'

const COUNT = 1

const INTITIAL_STATE = {
  data: null,
  categories: null,
  categorySelected: null,
  vocalbularies: null,
  vocalbularySelected: null,
  formData: { value: '', errMsg: '' },
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = JSON.parse(JSON.stringify(INTITIAL_STATE))
  }
  componentDidMount() {
    let _data = DATA.get()
    if (!_data) {
      _data = JSON.parse(JSON.stringify(default_data))
    }
    this.setState({data: _data})

    // // set categories
    // let _categories = JSON.parse(JSON.stringify(categories))
    // for (let i = 0; i < _categories.length; i++) {
    //   let category = _categories[i]
    //   category.id = Date.now()
    //   for (let j = 0; j < category.vocalbularies.length; j++) {
    //     let vocalbulary = category.vocalbularies[j]
    //     let _text = []
    //     for (let k = 0; k < vocalbulary.text.length; k++) {
    //       let text = vocalbulary.text[k]
    //       if (text) {
    //         _text.push(text.trim().toLowerCase())
    //       }
    //     }
    //     vocalbulary.text = _text
    //   }
    // }

    // // set categorySelected
    // let categorySelected = _categories[0]

    // // set vocalbularies
    // let vocalbularies = []
    // for (let i = 0; i < categorySelected.vocalbularies.length; i++) {
    //   for (let j = 0; j < COUNT; j++) {
    //     let _vocalbulary = {
    //       ...categorySelected.vocalbularies[i],
    //       id: Date.now(),
    //     }
    //     vocalbularies.push(_vocalbulary)
    //   }
    // }

    // // set vocalbularySelected
    // let vocalbularySelected = vocalbularies[Math.floor(Math.random() * vocalbularies.length)]

    // this.setState({
    //   categories: _categories,
    //   categorySelected,
    //   vocalbularies,
    //   vocalbularySelected,
    // })
  }
  handleSelectCategory = (categorySelected) => {
    // set vocalbularies
    let vocalbularies = []
    for (let i = 0; i < categorySelected.vocalbularies.length; i++) {
      for (let j = 0; j < COUNT; j++) {
        let _vocalbulary = {
          ...categorySelected.vocalbularies[i],
          id: Date.now(),
        }
        vocalbularies.push(_vocalbulary)
      }
    }

    // set vocalbularySelected
    let vocalbularySelected = vocalbularies[Math.floor(Math.random() * vocalbularies.length)]

    this.setState({
      categorySelected,
      vocalbularies,
      vocalbularySelected,
      confirmSelectCategory: null,
    })
  }
  handleSubmit = () => {
    const { formData, vocalbularies, vocalbularySelected } = this.state
    console.log('handleSubmit')

    if (vocalbularySelected.text.includes(formData.value.trim().toLowerCase())) {
      console.log('correct')

      // reset vocalbularies
      let _vocalbularies = []
      for (let i = 0; i < vocalbularies.length; i++) {
        if (vocalbularies[i].id !== vocalbularySelected.id) {
          _vocalbularies.push(vocalbularies[i])
        }
      }

      // set vocalbularySelected
      let _vocalbularySelected = _vocalbularies[Math.floor(Math.random() * _vocalbularies.length)]

      this.setState({
        vocalbularies: _vocalbularies,
        vocalbularySelected: _vocalbularySelected,
        formData: { value: '', errMsg: '' },
      })
    } else {
      console.log('incorrect')

      let str = ''
      vocalbularySelected.text.forEach((item) => (str += str ? ` or ${item}` : item))
      this.setState({ formData: { ...formData, errMsg: str } })
    }
  }
  handleNextVocabulary = () => {
    const { vocalbularies, vocalbularySelected } = this.state
    console.log('handleNextVocabulary')

    // reset vocalbularies
    let _vocalbularies = JSON.parse(JSON.stringify(vocalbularies))
    let _vocalbularySelected = { ...vocalbularySelected, id: Date.now() }
    _vocalbularies.push(_vocalbularySelected)

    // set vocalbularySelected
    _vocalbularySelected = _vocalbularies[Math.floor(Math.random() * _vocalbularies.length)]

    this.setState({
      vocalbularies: _vocalbularies,
      vocalbularySelected: _vocalbularySelected,
      formData: { value: '', errMsg: '' },
    })
  }
  render() {
    const {
      categories,
      categorySelected,
      vocalbularies,
      vocalbularySelected,
      confirmSelectCategory,
      formData,
    } = this.state
    console.log('this.state :>> ', this.state)

    console.log('vocalbularySelected.id :>> ', vocalbularySelected?.id)

    return (
      <div className="Home">
        <div className="header">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {categorySelected ? categorySelected.label : 'Select category'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {categories?.length > 0 &&
                categories.map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => this.setState({ confirmSelectCategory: item })}
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>

          {vocalbularies && categorySelected && (
            <div className="header-total">
              {vocalbularies.length}/{categorySelected.vocalbularies.length * COUNT}
            </div>
          )}
        </div>

        {vocalbularySelected && (
          <div className="body-main">
            <img alt={vocalbularySelected.text} src={vocalbularySelected.imageUrl} />

            {formData.errMsg && <div className="error-block">{formData.errMsg}</div>}

            {formData.errMsg ? (
              <div className="form-main form-main-next">
                <Button variant="danger" onClick={() => this.handleNextVocabulary()}>
                  warning
                </Button>
              </div>
            ) : (
              <div className="form-main">
                <Form.Control
                  autoFocus
                  type="text"
                  placeholder="Enter text"
                  value={formData.value}
                  onChange={(e) =>
                    this.setState({
                      formData: { value: e.target.value, errMsg: '' },
                    })
                  }
                  onKeyDown={(e) =>
                    formData.value && e.key === 'Enter' ? this.handleSubmit() : null
                  }
                />
                <Button
                  variant={formData.value ? 'primary' : 'light'}
                  onClick={() => (formData.value ? this.handleSubmit() : null)}
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        )}

        {confirmSelectCategory && (
          <Modal show={true} onHide={() => this.setState({ confirmSelectCategory: null })}>
            <Modal.Header closeButton>
              <Modal.Title>Notifycation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure want to change the category?</p>
              <p>All previous vocabulary will be reset</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.setState({ confirmSelectCategory: null })}
              >
                CANCEL
              </Button>
              <Button
                variant="primary"
                onClick={() => this.handleSelectCategory(confirmSelectCategory)}
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
