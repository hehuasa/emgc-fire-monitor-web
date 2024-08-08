import { Box, HStack } from '@chakra-ui/react';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';

const BreadcrumbName = ({
  names,
  fold,
  setFold,
}: {
  names: { name: string; url: string }[];
  fold?: boolean;
  setFold?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <HStack
      borderTopRadius="card.md"
      width={'max-content'}
      paddingTop={2}
      paddingBottom={2}
      paddingLeft={4}
      paddingRight={4}
      bg="pri.blacks.100"
    >
      {fold !== undefined && setFold !== undefined ? (
        <Box
          cursor="pointer"
          fontSize="18px"
          _hover={{ color: 'pri.blue.100' }}
          onClick={() => {
            setFold(!fold);
          }}
        >
          {fold ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
        </Box>
      ) : (
        <></>
      )}

      {names?.map((item, index) => {
        return (
          <Box key={item.url} color={'font.200'}>
            <Box display="inline-block" mr="2">
              {item.name}
            </Box>
            {index < names.length - 1 ? '/' : ''}
          </Box>
        );
      })}
    </HStack>
  );
};

export default BreadcrumbName;
