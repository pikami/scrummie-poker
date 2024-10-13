import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  Font,
  Code,
  Strikethrough,
  Table,
  SourceEditing,
  List,
  Link,
  Image,
  Indent,
  Subscript,
  Superscript,
  BlockQuote,
  CodeBlock,
  TodoList,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface RichEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  onBlur: () => void;
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, onBlur }) => {
  return (
    <CKEditor
      data={value}
      onBlur={onBlur}
      onChange={(_, editor) => onChange(editor.getData())}
      editor={ClassicEditor}
      config={{
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'fontfamily',
            'fontsize',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'strikethrough',
            'subscript',
            'superscript',
            'code',
            '|',
            'link',
            'blockQuote',
            'codeBlock',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'outdent',
            'indent',
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Undo,
          Heading,
          Font,
          Code,
          Bold,
          Strikethrough,
          Essentials,
          Italic,
          Mention,
          Paragraph,
          Table,
          SourceEditing,
          List,
          Link,
          Image,
          Indent,
          Subscript,
          Superscript,
          BlockQuote,
          CodeBlock,
          TodoList,
        ],
        initialData: '',
      }}
    />
  );
};

export default RichEditor;
