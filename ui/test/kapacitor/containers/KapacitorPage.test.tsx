import React from 'react'
import {
  KapacitorPage,
  defaultName,
  kapacitorPort,
} from 'src/kapacitor/containers/KapacitorPage'
import KapacitorForm from 'src/kapacitor/components/KapacitorForm'
import KapacitorFormInput from 'src/kapacitor/components/KapacitorFormInput'
import {mount} from 'enzyme'
import {getKapacitor, createKapacitor, updateKapacitor} from 'src/shared/apis'

import {source, kapacitor} from 'test/resources'
import * as mocks from 'mocks/dummy'

jest.mock('src/shared/apis', () => require('mocks/shared/apis'))

const setup = (override = {}) => {
  const props = {
    source: source,
    notify: () => {},
    kapacitor,
    router: {
      push: () => {},
      replace: () => {},
    },
    location: {pathname: '', hash: ''},
    params: {id: '', hash: ''},
    ...override,
  }

  const wrapper = mount(<KapacitorPage {...props} />)

  return {
    wrapper,
    props,
  }
}

describe('Kapacitor.Containers.KapacitorPage', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the KapacitorPage', () => {
      const {wrapper} = setup()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders the KapacitorForm', async () => {
      const {wrapper} = setup()
      const form = wrapper.find(KapacitorForm)

      expect(form.exists()).toBe(true)
    })
  })

  describe('user interactions ', () => {
    describe('entering the url', () => {
      describe('with a http url', () => {
        it('renders the text that is inputted', () => {
          const {wrapper} = setup()
          const value = 'http://example.com'
          const event = {target: {value}}

          let inputElement = wrapper.find('#kapaUrl')

          inputElement.simulate('change', event)

          inputElement = wrapper.find('#kapaUrl')
          const secureCheckbox = wrapper.find('#insecureSkipVerifyCheckbox')

          expect(secureCheckbox.exists()).toBe(false)
          expect(inputElement.prop('value')).toBe(value)
        })
      })

      describe('with a https url', () => {
        let inputElement, secureCheckbox, wrapper
        const value = 'https://example.com'

        beforeEach(() => {
          wrapper = setup().wrapper
          const event = {target: {value}}

          inputElement = wrapper.find('#kapaUrl')
          inputElement.simulate('change', event)
          inputElement = wrapper.find('#kapaUrl')
          secureCheckbox = wrapper.find('#insecureSkipVerifyCheckbox')
        })

        describe('checking the insecure skip verify checkbox', () => {
          it("changes the state", () => {
            const checked = true
            const event = {target: {checked}}

            secureCheckbox.simulate('change', event)
            secureCheckbox = wrapper.find('#insecureSkipVerifyCheckbox')
            expect(secureCheckbox.prop('checked')).toBe(true)
          })
        })

        it('renders the https secure checkbox', () => {
          expect(secureCheckbox.exists()).toBe(true)
          expect(inputElement.prop('value')).toBe(value)
        })
      })
    })

    describe('entering the kapacitor name', () => {
      it('renders the text that is inputted', () => {
        const {wrapper} = setup()
        const value = 'My New Kapacitor'
        const event = {target: {value, name: 'name'}}

        let input = wrapper.find('#name')

        input.simulate('change', event)
        wrapper.update()

        input = wrapper.find('#name')

        expect(input.prop('value')).toBe(value)
      })
    })

    describe('entering the username', () => {
      it('renders the text that is inputted', () => {
        const {wrapper} = setup()
        const value = 'user1'
        const event = {target: {value, name: 'username'}}

        let input = wrapper.find('#username')

        input.simulate('change', event)
        wrapper.update()

        input = wrapper.find('#username')

        expect(input.prop('value')).toBe(value)
      })
    })

    describe('entering the password', () => {
      it('renders the text that is inputted', () => {
        const {wrapper} = setup()
        const value = 'password'
        const event = {target: {value, name: 'password'}}

        let input = wrapper.find('#password')

        input.simulate('change', event)
        wrapper.update()

        input = wrapper.find('#password')

        expect(input.prop('value')).toBe(value)
      })
    })

    describe('submitting the form', () => {
      it('creates a new Kapacitor if there is no kapacitor', async () => {
        const {wrapper} = setup()
        const submit = wrapper.find({'data-test': 'submit-button'})

        submit.simulate('submit')

        expect(createKapacitor).toHaveBeenCalled()
        expect(updateKapacitor).not.toHaveBeenCalled()
      })

      it('updates an existing Kapacitor if there is a kapacitor', () => {
        const props = {params: {id: '1', hash: ''}}
        const {wrapper} = setup(props)
        const submit = wrapper.find({'data-test': 'submit-button'})

        submit.simulate('submit')

        expect(updateKapacitor).toHaveBeenCalled()
        expect(createKapacitor).not.toHaveBeenCalled()
      })
    })

    describe('clicking the `reset` button', () => {
      it('resets all inputs to their defaults', () => {
        const {wrapper} = setup()

        const url = wrapper.find('#kapaUrl')
        const name = wrapper.find('#name')
        const username = wrapper.find('#username')
        const password = wrapper.find('#password')

        const value = 'reset me'

        // change all values to some non-default value
        url.simulate('change', {target: {value}})
        name.simulate('change', {target: {value, name: 'name'}})
        username.simulate('change', {target: {value, name: 'username'}})
        password.simulate('change', {target: {value, name: 'password'}})

        const inputs = wrapper.find(KapacitorFormInput)
        inputs.map(n => expect(n.find('input').prop('value')).toBe(value))

        // reset
        const reset = wrapper.find({'data-test': 'reset-button'})
        reset.simulate('click')

        expect(url.prop('value')).toBe(`https://localhost:${kapacitorPort}`)
        expect(name.prop('value')).toBe(defaultName)
        expect(username.prop('value')).toBe('')
        expect(password.prop('value')).toBe('')
      })
    })
  })

  describe('instance methods', () => {
    describe('componentDidMount', () => {
      describe('if it is a new kapacitor', () => {
        it('does not get the kapacitor', async () => {
          const {wrapper} = setup()

          await wrapper.instance().componentDidMount()

          expect(getKapacitor).not.toHaveBeenCalled()
        })
      })

      describe('if it is an existing kapacitor', () => {
        it('gets the kapacitor info and sets the appropriate state', async () => {
          const params = {id: '1', hash: ''}
          const {wrapper} = setup({params})

          await wrapper.instance().componentDidMount()

          expect(wrapper.state().kapacitor).toEqual(mocks.kapacitor)
          expect(wrapper.state().exists).toBe(true)
        })
      })
    })
  })
})
