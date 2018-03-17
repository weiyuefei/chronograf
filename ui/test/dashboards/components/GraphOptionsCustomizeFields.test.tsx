import React from 'react'

import GraphOptionsCustomizeFields from 'src/dashboards/components/GraphOptionsCustomizeFields'
import GraphOptionsCustomizableField from 'src/dashboards/components/GraphOptionsCustomizableField'
import {TIME_FIELD_DEFAULT} from 'src/shared/constants/tableGraph'

import {shallow} from 'enzyme'

const setup = (override = {}) => {
  const props = {
    fields: [],
    onFieldUpdate: () => {},
    ...override,
  }

  const wrapper = shallow(<GraphOptionsCustomizeFields {...props} />)

  return {wrapper, props}
}

describe('Dashboards.Components.GraphOptionsCustomizableField', () => {
  describe('rendering', () => {
    it('displays label and all fields passed in', () => {
      const fields = [TIME_FIELD_DEFAULT]
      const {wrapper} = setup({fields})
      const label = wrapper.find('label')
      const CustomizableFields = wrapper.find(GraphOptionsCustomizableField)

      expect(label.exists()).toBe(true)
      expect(CustomizableFields.exists()).toBe(true)
      expect(CustomizableFields.length).toBe(fields.length)
    })
  })
})
