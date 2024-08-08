'use client';

import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, ComponentWithAs, Flex, FlexProps, HStack, Icon, IconProps, Link } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { AiOutlineEdit, AiOutlineUser } from 'react-icons/ai';
import EditPassword from './editPassword';
import PersonalInfo from './personalInfo';
import { useIntl } from 'react-intl';

interface LinkItemProps {
  name: string;
  icon: ComponentWithAs<'svg', IconProps>;
}
interface NavItemProps extends FlexProps {
  icon: ComponentWithAs<'svg', IconProps>;
  children: ReactNode;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};




const Center = () => {
  const { formatMessage } = useIntl()

  const LinkItems: Array<LinkItemProps> = [
    { name: formatMessage({ id: 'personalInfo' }), icon: HamburgerIcon },
    { name: formatMessage({ id: 'passModify' }), icon: HamburgerIcon },
  ];
  if (process.env.NEXT_PUBLIC_ANALYTICS_Ms_type == 'yb') {
    LinkItems.pop();
  }

  const [showPage, setShowPage] = useState(formatMessage({ id: 'personalInfo' }));

  return (
    <Box display={'flex'} justifyContent={'space-between'} background={'backs.100'}>
      <Flex
        w={'220px'}
        h="160px"
        background={'backs.200'}
        borderRadius={'card.md'}
        flexDir="column"
        justify="center"
      // alignItems="flex-start"
      >
        {LinkItems.map((link) => (
          <HStack
            key={link.name}
            onClick={() => {
              setShowPage(link.name);
            }}
            cursor="pointer"
            pl="8"
            my="3"
            borderLeftWidth={showPage === link.name ? '3px' : '3px'}
            borderColor={showPage === link.name ? 'pri.blue.100' : 'transparent'}
            lineHeight="24px"
            color={showPage === link.name ? 'pri.blue.100' : 'font.200'}
          >
            {link.name == '个人信息' ? <Icon as={AiOutlineUser} mr="4" /> : <Icon as={AiOutlineEdit} mr="4" />}

            <Box>{link.name} </Box>
          </HStack>
        ))}
      </Flex>
      <Box pl={5} background={'backs.200'} w={'calc(100% - 240px)'} borderRadius={'card.md'}>
        {showPage == '个人信息' && <PersonalInfo></PersonalInfo>}
        {showPage == '修改密码' && <EditPassword></EditPassword>}
      </Box>
    </Box>
  );
};

export default Center;
