import button_active from '@/assets/emgcCommond/button_active.png';
import button_normal from '@/assets/emgcCommond/button_normal.png';
import { Button, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  buttonType?: 'default' | 'active';
}

const Button_ = (props: Props) => {
  const { buttonType, ...rest } = props;
  return (
    <Button
      w="106px"
      h="46px"
      backgroundSize={'100% 100%'}
      backgroundRepeat="no-repeat"
      background={`url(${buttonType === 'active' ? button_active.src : button_normal.src})`}
      _hover={{
        backgroundImage: `url(${buttonType === 'active' ? button_active.src : button_normal.src})`,
      }}
      color="#fff"
      {...rest}
    >
      {props.children}
    </Button>
  );
};

export { Button_ };
