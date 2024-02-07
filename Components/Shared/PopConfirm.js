import { Modal } from 'antd';
const { confirm } = Modal;

function PopConfirm(popTitle, popContent, onOkClick) {
    confirm({
      title: `${popTitle}`,
      content:`${popContent}`,
      async onOk() {
        try {
            onOkClick();
        } catch (e) {
          return console.log('Oops errors!');
        }
      },
      onCancel() {
      },
    });
  }

export default PopConfirm
