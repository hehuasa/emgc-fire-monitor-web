import { IMenuItem } from '@/models/user';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  fold: boolean;
  url: string;
  name: string;
  subItems: IMenuItem[] | undefined;
}

const NavItem = ({ subItems, name, url, fold, ...rest }: NavItemProps) => {
  const pathname = usePathname() as string;
  // const isCheck =
  //   (process.env.NEXT_PUBLIC_ANALYTICS_BasePath + url).indexOf(pathname) !== -1 ||
  //   Boolean(
  //     subItems?.find(
  //       (val) => (process.env.NEXT_PUBLIC_ANALYTICS_BasePath + val.url).indexOf(pathname) !== -1
  //     )
  //   );
  const menuItem = subItems?.filter((item) => item.funType === 1 && !item.hidden);

  const isCheck =
    (process.env.NEXT_PUBLIC_ANALYTICS_BasePath + url).endsWith(pathname) ||
    Boolean(
      menuItem?.find((val) =>
        (process.env.NEXT_PUBLIC_ANALYTICS_BasePath + val.url).endsWith(pathname)
      )
    );

  return menuItem && menuItem.length ? (
    <AccordionItem border={0} mb={'2px'}>
      <AccordionButton p="0" _hover={{ bg: 'unset' }}>
        {fold && (
          <Popover placement="right" trigger="hover">
            <PopoverTrigger>
              <Box
                fontSize={'md'}
                role="group"
                cursor="pointer"
                color={isCheck ? 'pri.black.100' : 'pri.dark.500'}
                bg={isCheck ? 'pri.white.100' : ''}
                fontWeight={isCheck ? '500' : 'unset'}
                borderRadius="4px"
                _hover={{
                  color: 'pri.white.100',
                  bg: 'pri.blue.100',
                }}
                // p="2"
                {...rest}
              ></Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Flex
                  align="center"
                  fontSize={'md'}
                  role="group"
                  cursor="pointer"
                  color={isCheck ? 'pri.black.100' : 'pri.dark.500'}
                  bg={isCheck ? 'pri.white.100' : ''}
                  borderRadius="4px"
                  _hover={{
                    color: 'pri.black.100',
                  }}
                  // p="2"
                  {...rest}
                >
                  <Box
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    display={{ base: 'none', xl: 'flex' }}
                    paddingLeft="10px"
                  >
                    {name}
                  </Box>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
        {!fold && (
          <Flex
            w={'full'}
            align="center"
            fontSize={'md'}
            role="group"
            cursor="pointer"
            color={isCheck ? 'pri.black.100' : 'pri.dark.500'}
            bg={isCheck ? 'pri.white.100' : ''}
            borderRadius="4px"
            fontWeight={isCheck ? 'bold' : '400'}
            _hover={{
              color: 'pri.black.100',
            }}
            p="2"
            {...rest}
          >
            <Box
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              display={{ base: 'none', xl: 'flex' }}
              paddingLeft="10px"
            >
              {name}
            </Box>
            <AccordionIcon ml="3" />
          </Flex>
        )}
      </AccordionButton>
      {menuItem.map((item) => {
        return (
          <AccordionPanel
            key={item.functionCode}
            p="0"
            pl={fold ? 'unset' : 2}
            bg={item.url.endsWith(pathname) ? '#EEF5FE' : ''}
          >
            <NavItem fold={fold} name={item.functionName} subItems={item.children} url={item.url} />
          </AccordionPanel>
        );
      })}
    </AccordionItem>
  ) : (
    <Link
      as={NextLink}
      href={url}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      {/* {fold && (
        <Popover placement={'right'} trigger="hover" boundary="scrollParent">
          <PopoverTrigger>
            <Box
              fontSize={'md'}
              role="group"
              cursor="pointer"
              color={isCheck ? 'pri.blue.100' : 'pri.black.100'}
              bg={isCheck ? 'pri.blue.400' : ''}
              borderRadius="4px"
              mt="1"
              _hover={{
                color: 'pri.blue.100',
                bg: 'pri.blue.400',
              }}
              // p="2"
              {...rest}
            ></Box>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Flex
                align="center"
                fontSize={'md'}
                role="group"
                cursor="pointer"
                color={isCheck ? 'pri.blue.100' : 'pri.black.100'}
                bg={isCheck ? 'pri.blue.400' : ''}
                borderRadius="4px"
                mt="1"
                _hover={{
                  color: 'pri.blue.100',
                  bg: 'pri.blue.400',
                }}
                // p="2"
                {...rest}
              >
                {
                  <Box
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    display={{ base: 'none', xl: 'flex' }}
                    paddingLeft="10px"
                  >
                    {name}
                  </Box>
                }
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )} */}
      {!fold && (
        <Flex
          align="center"
          alignItems={'center'}
          fontSize={'md'}
          role="group"
          cursor="pointer"
          color={isCheck ? 'pri.blue.100' : '#778CA2'}
          bg={isCheck ? '#EEF5FE' : ''}
          _hover={{
            color: 'pri.blue.100',
            bg: '#EEF5FE',
          }}
          p="2"
          style={
            isCheck
              ? {
                  borderRightWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#0078EC',
                }
              : { ...rest }
          }
          {...rest}
        >
          <Box
            marginLeft="10px"
            w={1.5}
            h={1.5}
            borderRadius={'50%'}
            bg={isCheck ? '#0078EC' : '#778CA2'}
          ></Box>
          <Box
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            display={{ base: 'none', xl: 'flex' }}
            pl={'10px'}
          >
            {name}
          </Box>
        </Flex>
      )}
    </Link>
  );
};

const LeftSideBar = ({
  linkItems,
  fold,
  defaultExpand = true,
}: {
  linkItems: Array<IMenuItem>;
  fold: boolean;
  defaultExpand?: boolean;
}) => {
  const pathname = usePathname() as string;

  if (linkItems.length === 0) {
    return null;
  }
  const filterMenu = linkItems.filter((item) => item.funType === 1 && !item.hidden);

  const index: number[] = [];
  if (defaultExpand) {
    const index_ = filterMenu.keys();
    Object.assign(index, [...index_]);
  } else {
    const index_ = filterMenu
      .filter((val) => val.children && val.children.length > 0)
      .findIndex(
        (link) =>
          (process.env.NEXT_PUBLIC_ANALYTICS_BasePath + link.url).indexOf(pathname) !== -1 ||
          Boolean(
            link.children?.find(
              (val) =>
                (process.env.NEXT_PUBLIC_ANALYTICS_BasePath + val.url).indexOf(pathname) !== -1
            )
          )
      );
    index.push(index_);
  }

  let currentMenu: number[] = [];
  const temp: any = linkItems.filter((item) => item.funType === 1 && !item.hidden);
  const newTemp: any = [];

  const hasChildrenMenus = (menus: any) => {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].children?.length !== 0) {
        newTemp.push(menus[i]);
        hasChildrenMenus(menus[i].children);
      }
    }
  };

  hasChildrenMenus(temp);
  for (let i = 0; i < newTemp.length; i++) {
    newTemp[i].children?.map((child: any) => {
      if (pathname.indexOf(child.url) !== -1 && child.url !== '/') {
        currentMenu.push(i);
        return;
      }
    });
  }

  return (
    <Accordion
      w={'full'}
      h="full"
      defaultIndex={currentMenu}
      allowMultiple
      allowToggle
      borderRightWidth="1px"
      borderRightColor="pri.gray.100"
    >
      {filterMenu.map((link) => (
        <NavItem
          fold={fold}
          name={link.functionName}
          subItems={link.children}
          key={link.functionCode}
          url={link.url}
        />
      ))}
    </Accordion>
  );
};

export default LeftSideBar;
