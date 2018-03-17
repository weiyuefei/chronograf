import React, {PureComponent} from 'react'

import InputClickToEdit from 'src/shared/components/InputClickToEdit'

type Field = {
  internalName: string
  displayName: string
  visible: boolean
}

interface Props {
  internalName: string
  displayName: string
  visible: boolean
  onFieldUpdate: (field: Field) => void
}

class GraphOptionsCustomizableField extends PureComponent<Props, {}> {
  constructor(props) {
    super(props)

    this.handleFieldRename = this.handleFieldRename.bind(this)
    this.handleToggleVisible = this.handleToggleVisible.bind(this)
  }

  handleFieldRename(rename: string) {
    const {onFieldUpdate, internalName, visible} = this.props
    onFieldUpdate({internalName, displayName: rename, visible})
  }

  handleToggleVisible() {
    const {onFieldUpdate, internalName, displayName, visible} = this.props
    onFieldUpdate({internalName, displayName, visible: !visible})
  }

  render() {
    const {internalName, displayName, visible} = this.props

    return (
      <div className="field-controls--section">
        <div
          className={
            visible ? 'field-controls--label' : 'field-controls--label-hidden'
          }
        >
          <span className="icon eye" onClick={this.handleToggleVisible} />
          {internalName}
        </div>
        <InputClickToEdit
          value={displayName}
          wrapperClass="field-controls-input"
          onBlur={this.handleFieldRename}
          placeholder="Rename..."
          appearAsNormalInput={true}
          disabled={!visible}
        />
      </div>
    )
  }
}

export default GraphOptionsCustomizableField
