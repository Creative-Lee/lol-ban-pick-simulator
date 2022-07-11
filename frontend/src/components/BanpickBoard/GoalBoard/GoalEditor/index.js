import React from 'react'
import { Editor } from '@toast-ui/react-editor'

import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'

export default function GoalEditor({ editorRef, onChangeEditor, viewerInput }) {
  return (
    <Editor
      initialValue={viewerInput}
      previewStyle='tap'
      hideModeSwitch={true}
      viewer={false}
      height='100%'
      minHeight='300px'
      initialEditType='wysiwyg'
      useCommandShortcut={false}
      language='ko-KR'
      ref={editorRef}
      onChange={() => {
        onChangeEditor()
      }}
      usageStatistics={false}
      plugins={[colorSyntax]}
      toolbarItems={[
        // 툴바 옵션 설정
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol'],
      ]}
    />
  )
}
