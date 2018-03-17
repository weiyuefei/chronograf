import React from 'react'

import {TableOptions} from 'src/dashboards/components/TableOptions'

import FancyScrollbar from 'src/shared/components/FancyScrollbar'
import GraphOptionsTimeFormat from 'src/dashboards/components/GraphOptionsTimeFormat'
import GraphOptionsTimeAxis from 'src/dashboards/components/GraphOptionsTimeAxis'
import GraphOptionsSortBy from 'src/dashboards/components/GraphOptionsSortBy'
import GraphOptionsTextWrapping from 'src/dashboards/components/GraphOptionsTextWrapping'
import GraphOptionsCustomizeFields from 'src/dashboards/components/GraphOptionsCustomizeFields'
import ThresholdsList from 'src/shared/components/ThresholdsList'
import ThresholdsListTypeToggle from 'src/shared/components/ThresholdsListTypeToggle'

import {shallow} from 'enzyme'

const setup = (override = {}) => {
  const props = {
    queryConfigs: [],
    handleUpdateTableOptions: () => {},
    tableOptions: {
      timeFormat: '',
      verticalTimeAxis: true,
      sortBy: {internalName: '', displayName: '', visible: true},
      wrapping: '',
      fieldNames: [],
    },
    onResetFocus: () => {},
    ...override,
  }

  const wrapper = shallow(<TableOptions {...props} />)

  return {wrapper, props}
}

describe('Dashboards.Components.TableOptions', () => {
  describe('rendering', () => {
    it('should render all components', () => {
      const {wrapper} = setup()
      const fancyScrollbar = wrapper.find(FancyScrollbar)
      const graphOptionsTimeFormat = wrapper.find(GraphOptionsTimeFormat)
      const graphOptionsTimeAxis = wrapper.find(GraphOptionsTimeAxis)
      const graphOptionsSortBy = wrapper.find(GraphOptionsSortBy)
      const graphOptionsTextWrapping = wrapper.find(GraphOptionsTextWrapping)
      const graphOptionsCustomizeFields = wrapper.find(
        GraphOptionsCustomizeFields
      )
      const thresholdsList = wrapper.find(ThresholdsList)
      const thresholdsListTypeToggle = wrapper.find(ThresholdsListTypeToggle)

      expect(fancyScrollbar.exists()).toBe(true)
      expect(graphOptionsTimeFormat.exists()).toBe(true)
      expect(graphOptionsTimeAxis.exists()).toBe(true)
      expect(graphOptionsSortBy.exists()).toBe(true)
      expect(graphOptionsTextWrapping.exists()).toBe(true)
      expect(graphOptionsCustomizeFields.exists()).toBe(true)
      expect(thresholdsList.exists()).toBe(true)
      expect(thresholdsListTypeToggle.exists()).toBe(true)
    })
  })
})
