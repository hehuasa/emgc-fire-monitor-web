import { request } from '@/utils/request';
import { Box, Divider, HStack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
type userInfoType = {
  userName?: string;
  loginAccount?: string;
  mobile?: string;
  orgName?: string;
  positionName?: string;
};

const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState<userInfoType>({});

  //获取用户信息
  const getUserInfo = useCallback(async () => {
    const infoStr: string = localStorage.getItem('emgc_web_currentUserInfo') ?? '';
    const userInfo = JSON.parse(infoStr);
    const { code, data } = await request({
      url: `/ms-system/user/get/detail/${userInfo.userId}`,
    });

    if (code == 200) {
      setPersonalInfo(data as userInfoType);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <Box p={3} color="font.200">
        <HStack mb="8">
          <Box bg="pri.blue.100" w="1.5" h="4" borderRadius="6px" mr="1"></Box>
          <Box fontSize="20px" fontWeight="500">
            个人信息
          </Box>
        </HStack>

        <Box pl="3" lineHeight="60px">
          人员姓名：{personalInfo.userName}
        </Box>
        <Divider></Divider>
        <Box pl="3" lineHeight="60px">
          账户名称：{personalInfo.loginAccount}
        </Box>
        <Divider></Divider>
        <Box pl="3" lineHeight="60px">
          手机号码：{personalInfo.mobile}
        </Box>
        <Divider></Divider>
        <Box pl="3" lineHeight="60px">
          部门-岗位：{personalInfo.orgName}-{personalInfo.positionName}
        </Box>
        <Divider></Divider>
      </Box>
    </>
  );
};

export default PersonalInfo;
