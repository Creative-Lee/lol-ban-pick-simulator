import React from 'react'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import { Viewer } from '@toast-ui/react-editor'

export default function GoalViewer({ viewerInput }) {
  return <Viewer initialValue={viewerInput} />
}
