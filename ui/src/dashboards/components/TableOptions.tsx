import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import _ from 'lodash'

import FancyScrollbar from 'src/shared/components/FancyScrollbar'
import GraphOptionsTimeFormat from 'src/dashboards/components/GraphOptionsTimeFormat'
import GraphOptionsTimeAxis from 'src/dashboards/components/GraphOptionsTimeAxis'
import GraphOptionsSortBy from 'src/dashboards/components/GraphOptionsSortBy'
import GraphOptionsTextWrapping from 'src/dashboards/components/GraphOptionsTextWrapping'
import GraphOptionsCustomizeFields from 'src/dashboards/components/GraphOptionsCustomizeFields'
import ThresholdsList from 'src/shared/components/ThresholdsList'
import ThresholdsListTypeToggle from 'src/shared/components/ThresholdsListTypeToggle'

import {TIME_FIELD_DEFAULT} from 'src/shared/constants/tableGraph'
import {updateTableOptions} from 'src/dashboards/actions/cellEditorOverlay'

type RenamableField = {
  internalName: string
  displayName: string
  visible: boolean
}

type Options = {
  timeFormat: string
  verticalTimeAxis: boolean
  sortBy: RenamableField
  wrapping: string
  fieldNames: RenamableField[]
}

type QueryConfig = {
  measurement: string
  fields: [
    {
      alias: string
      value: string
    }
  ]
}

interface Props {
  queryConfigs: QueryConfig[]
  handleUpdateTableOptions: (options: Options) => void
  tableOptions: Options
  onResetFocus: () => void
}

export class TableOptions extends PureComponent<Props, {}> {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {queryConfigs, handleUpdateTableOptions, tableOptions} = this.props
    const {fieldNames} = tableOptions
    const timeField =
      (fieldNames && fieldNames.find(c => c.internalName === 'time')) ||
      TIME_FIELD_DEFAULT

    const fields = [
      timeField,
      ..._.flatten(
        queryConfigs.map(qc => {
          const {measurement, fields} = qc
          return fields.map(f => {
            const internalName = `${measurement}.${f.alias}`
            const existing = fieldNames.find(
              c => c.internalName === internalName
            )
            return existing || {internalName, displayName: '', visible: true}
          })
        })
      ),
    ]

    handleUpdateTableOptions({...tableOptions, fieldNames: fields})
  }

  handleChooseSortBy = () => {}

  handleTimeFormatChange = timeFormat => {
    const {tableOptions, handleUpdateTableOptions} = this.props
    handleUpdateTableOptions({...tableOptions, timeFormat})
  }

  handleToggleTimeAxis = () => {}

  handleToggleTextWrapping = () => {}

  handleFieldUpdate = field => {
    const {handleUpdateTableOptions, tableOptions} = this.props
    const {fieldNames} = tableOptions
    const updatedFields = fieldNames.map(
      op => (op.internalName === field.internalName ? field : op)
    )
    handleUpdateTableOptions({...tableOptions, fieldNames: updatedFields})
  }

  render() {
    const {tableOptions: {timeFormat, fieldNames}, onResetFocus} = this.props

    const TimeAxis = 'vertical'

    const tableSortByOptions = [
      'cpu.mean_usage_system',
      'cpu.mean_usage_idle',
      'cpu.mean_usage_user',
    ].map(col => ({text: col}))

    return (
      <FancyScrollbar
        className="display-options--cell y-axis-controls"
        autoHide={false}
      >
        <div className="display-options--cell-wrapper">
          <h5 className="display-options--header">Table Controls</h5>
          <div className="form-group-wrapper">
            <GraphOptionsTimeFormat
              timeFormat={timeFormat}
              onTimeFormatChange={this.handleTimeFormatChange}
            />
            <GraphOptionsTimeAxis
              TimeAxis={TimeAxis}
              onToggleTimeAxis={this.handleToggleTimeAxis}
            />
            <GraphOptionsSortBy
              sortByOptions={tableSortByOptions}
              onChooseSortBy={this.handleChooseSortBy}
            />
            <GraphOptionsTextWrapping
              thresholdsListType="background"
              onToggleTextWrapping={this.handleToggleTextWrapping}
            />
          </div>
          <GraphOptionsCustomizeFields
            fields={fieldNames}
            onFieldUpdate={this.handleFieldUpdate}
          />
          <ThresholdsList showListHeading={true} onResetFocus={onResetFocus} />
          <div className="form-group-wrapper graph-options-group">
            <ThresholdsListTypeToggle containerClass="form-group col-xs-6" />
          </div>
        </div>
      </FancyScrollbar>
    )
  }
}

const mapStateToProps = ({cellEditorOverlay: {cell: {tableOptions}}}) => ({
  tableOptions,
})

const mapDispatchToProps = dispatch => ({
  handleUpdateTableOptions: bindActionCreators(updateTableOptions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(TableOptions)
