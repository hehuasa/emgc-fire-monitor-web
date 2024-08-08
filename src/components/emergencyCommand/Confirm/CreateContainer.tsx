import { createRoot, Root } from 'react-dom/client';
import Base from './Base';

let container: HTMLElement | null = null;
let root_: Root | null = null;

export interface IProps {
  title: string;
  ok?: () => Promise<void>;
}

const confirmModal = (props: IProps) => {
  const id = 'custom-emergency-confirm-container';
  const hasContainer = document.getElementById(id);

  if (!hasContainer) {
    container = document.createElement('div');
    container.id = id;
    document.body.append(container);
  } else {
    container = hasContainer;
  }
  if (!root_ && container) {
    root_ = createRoot(container);
  }
  const destory = () => {
    root_?.unmount();
    container = null;
    root_ = null;
  };
  root_?.render(<Base {...props} destory={destory} />);
};

export { confirmModal };
