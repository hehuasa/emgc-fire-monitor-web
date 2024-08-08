'use client';
import { ILayerItem } from '@/components/MapTools/LayerList';
import { request } from '@/utils/request';
import { Box, Button, ButtonGroup, Card, CardBody, Checkbox, CloseButton, Divider, Flex, HStack, Heading, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Radio, RadioGroup, Select, SimpleGrid, Text } from '@chakra-ui/react'
import { useMount } from 'ahooks';
import React, { useRef, useState } from 'react'
import { stringify } from 'qs';
import Pagination from '@/components/Pagination';
import { IPresets, IResPresets } from '../linkeditWithmap/page';
import Spin from '@/components/Loading/Spin';
import SmoothScrollbar from 'smooth-scrollbar';
import { useIntl } from 'react-intl';
import { FormItem } from 'amis';


interface IPageState {
    current: number;
    pages: number;
    size: number;
    total: number;
}
interface Iitem {
    "address": string,
    "areaId": string,
    "areaName": string,
    "cameraPresets":
    {
        "iotCameraId": string,
        "presetId": string,
        "presetIndex": 0,
        "presetName": string,
        "resourceId": string
    }[]
    ,
    "coordinate": string,
    "deptId": string,
    "deptName": string,
    "equipmentId": string,
    "floorLevel": string,
    "geoType": string,
    "hasVideo": 0,
    "icon": string,
    "id": string,
    "iotDeviceId": string,
    "iotSubDeviceId": string,
    "layerName": string,
    "resourceName": string,
    "resourceNo": string,
    "stationFlag": string
}
const initPage = {
    current: 1,
    pages: 1,
    size: 10,
    total: 10,
}
const EditModal = ({ value }: { value: string }) => {

    const [resourceName, setResourceName] = useState('')
    const [layerId, setLlayerId] = useState('')
    const [resourceNo, setResourceNo] = useState('')
    const { formatMessage } = useIntl();


    const [Layers, setLayers] = useState<ILayerItem[]>([]);

    const [pageState, setPageState] = useState<IPageState>(initPage);

    const [datas, setDatas] = useState<Iitem[]>([])
    const domRef = useRef<null | HTMLDivElement>(null);
    const [loading, setloading] = useState(false)
    const [currentPresets, setcurrentPresets] = useState<IPresets[]>([])

    useMount(async () => {

        const res = await request<ILayerItem[]>({ url: '/cx-alarm/resource/list-layer' });
        if (res && res.data) {
            setLayers(res.data.find((val) => val.id === "3")!.children)
        }
        getPageData("", "", "", pageState)
        getResPreset(value)

        setTimeout(() => {
            if (domRef.current) {
                SmoothScrollbar.init(domRef.current);
            }
        }, 500)

        // setTimeout(() => {
        //     onAction(null, { actionType: 'cancel', componentId: 'u:addb634c6e39' }, { componentId: 'u:addb634c6e39' })
        // }, 5 * 1000);


        // setTimeout(() => {
        //     onAction(null, { actionType: 'dialog' }, { title: 'test' })
        // }, 5 * 1000);

    })

    const getPageData = async (resourceName: string, layerId: string, resourceNo: string, pageState: IPageState) => {

        const obj = {
            resourceName,
            layerId,
            resourceNo,
            pageIndex: pageState.current,
            almResourceId: value,
            containPresetInfo: true,
            pageSize: pageState.size,
        }

        const pa = stringify(obj)
        const res = await request<{
            pages: number,
            "current": number,
            total: number,
            records: Iitem[]
        }>({ url: '/cx-alarm/device/manager/query-camera?' + pa });

        if (res && res.code === 200) {
            setDatas(res.data.records);
            setPageState({
                current: pageState.current,
                pages: pageState.pages,
                size: pageState.size,
                total: res.data.total,
            })
        }
    }

    // 获取当前资源的关联
    const getResPreset = async (id: string) => {
        setloading(true)

        request<IPresets[]>({
            url: '/cx-alarm/device/manager/list-camera-preset?resourceId=' + id, options: {
                method: "post",
                headers: {
                    "content-type": 'application/x-www-form-urlencoded'
                }
            }
        }).then((res) => {

            const array: IResPresets[] = [];
            setcurrentPresets(res.data);

            for (const { resourceNo, presetId, presetIndex, presetName, address, resourceName, cameraResourceId, id, rotatable } of res.data) {
                const index = array.findIndex(val => val.resourceNo === resourceNo);

                if (index !== -1) {
                    array[index].presets.push({
                        id,
                        presetId,
                        presetIndex,
                        presetName,
                        rotatable
                    })
                } else {
                    array.push({
                        cameraResourceId,
                        address,
                        resourceName,
                        resourceNo,
                        rotatable,
                        presets: [
                            {
                                id,
                                presetId,
                                presetIndex,
                                presetName,
                                rotatable
                            }
                        ]
                    })
                }
            }

            setcurrentResPresets(array)
            setloading(false)

        })
    }
    const [currentResPresets, setcurrentResPresets] = useState<IResPresets[]>([])

    console.info('============currentResPresets==============', currentResPresets);
    // 删除预置位
    const delPreset = async (id: string, resourceId: string) => {
        const url = `/cx-alarm/device/manager/delete-camera-preset/${id}`;

        const res = await request({
            url, options: {
                method: "post"
            }
        });
        getResPreset(resourceId)
        return res
    }
    // 删除整个摄像头的关联
    const delLinkedVideo = async (videoId: string, resourceId: string) => {
        const url = `/cx-alarm/device/manager/deleteLinkedCamera?almResourceId=${resourceId}&cameraResourceId=${videoId}`;
        const res = await request({
            url, options: {
                method: "delete"
            }
        });
        getResPreset(resourceId)
        return res
    }

    // const addPreset = async (almResourceId: string, cameraPresets: { cameraResourceId: string, presetIds: string[] }[]) => {
    //     const url = `/cx-alarm/device/manager/add-camera-preset`;
    //     const obj = {
    //         almResourceId,
    //         cameraPresets
    //     }
    //     setloading(true)

    //     const res = await request({ url, options: { method: "post", body: JSON.stringify(obj) } });
    //     setloading(false)

    //     getResPreset(almResourceId)


    // }
    const addPreset = async (almResourceId: string, cameraPresets: { cameraResourceId: string, presetIds: string[] }[]) => {
        const url = `/cx-alarm/device/manager/saveRelevanceVideo`;
        const obj = {
            almResourceId,
            cameraResourceId: cameraPresets[0].cameraResourceId,
            presetIds: cameraPresets[0].presetIds

        }
        setloading(true)

        const res = await request({ url, options: { method: "post", body: JSON.stringify(obj) } });
        setloading(false)

        getResPreset(almResourceId)


    }

    const changeRotatable = async (id: string, rotatable: number) => {
        const url = `/cx-alarm/device/manager/changeRotatable?id=${id}&rotatable=${rotatable}`;

        await request({
            url, options: {
                method: "put",
            }
        })
        getResPreset(value)

    }
    return (
        <Box>
            <Box>
                <Heading as='h5' size='sm' mb="4">
                    已配置联动
                </Heading>
                <Box ref={domRef} px="4">
                    <Spin spin={loading}>

                        <SimpleGrid columns={4} spacing={2} w="full">
                            {currentResPresets.map((video) => {

                                return <Card key={video.resourceNo} borderWidth="1px" borderColor="pri.gray.100">
                                    {/* <CardHeader py="2">
                                        <Heading size='xs' >{video.address + "-" + video.resourceName}</Heading>
                                    </CardHeader> */}
                                    <Popover
                                        returnFocusOnClose={false}
                                        closeOnBlur={false}
                                    >
                                        {({ onClose }) => {
                                            return <>
                                                <PopoverTrigger>
                                                    <CloseButton position="absolute" right="0.75" top="0.75" size='sm' />

                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <PopoverArrow />
                                                    <PopoverCloseButton />
                                                    <PopoverHeader>确认</PopoverHeader>
                                                    <PopoverBody>请确认是否删除整个摄像头关联?</PopoverBody>
                                                    <PopoverFooter display='flex' justifyContent='flex-end'>
                                                        <ButtonGroup size='sm'>
                                                            <Button variant='outline' onClick={onClose}>取消</Button>
                                                            <Button colorScheme='red' onClick={() => {
                                                                delLinkedVideo(video.cameraResourceId, value).then(() => {
                                                                    onClose()
                                                                })

                                                            }}>确认</Button>
                                                        </ButtonGroup>
                                                    </PopoverFooter>
                                                </PopoverContent></>
                                        }}
                                    </Popover>


                                    <CardBody h="30">

                                        {/* <SimpleGrid columns={4} spacing={1} > */}
                                        <Flex>
                                            <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                                工艺位号 :
                                            </Box>
                                            <Box flex={1} color="pri.dark.500">
                                                {video.resourceNo}
                                            </Box>
                                        </Flex>

                                        <Flex>
                                            <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                                {formatMessage({ id: 'emgc.res.name' })} :
                                            </Box>
                                            <Box flex={1} color="pri.dark.500">
                                                {video.resourceName}
                                            </Box>
                                        </Flex>

                                        <Flex>
                                            <Box w="18" whiteSpace="nowrap" color="pri.dark.100">
                                                预置位 :
                                            </Box>
                                            <Box flex={1} color="pri.dark.500">
                                                {
                                                    video.presets.map((preset) => {
                                                        return <Box key={preset.presetId}

                                                        // borderColor="pri.gray.100" 
                                                        // borderWidth="1px" p="1"

                                                        >
                                                            <Text>{preset.presetName}</Text>
                                                            {/* <Popover
                                                                returnFocusOnClose={false}
                                                                closeOnBlur={false}
                                                                placement="auto"
                                                            >
                                                                {({ onClose }) => {
                                                                    return <>
                                                                        <PopoverTrigger>
                                                                            <Button colorScheme='red' variant='link' >
                                                                                删除
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent>
                                                                            <PopoverArrow />
                                                                            <PopoverCloseButton />
                                                                            <PopoverHeader>确认</PopoverHeader>
                                                                            <PopoverBody>请确认是否删除?</PopoverBody>
                                                                            <PopoverFooter display='flex' justifyContent='flex-end'>
                                                                                <ButtonGroup size='sm'>
                                                                                    <Button variant='outline' onClick={onClose}>取消</Button>
                                                                                    <Button colorScheme='red' onClick={() => {
                                                                                        delPreset(preset.id, resourceId).then(() => {
                                                                                            onClose()
                                                                                        })
                                                                                    }}>确认</Button>
                                                                                </ButtonGroup>
                                                                            </PopoverFooter>
                                                                        </PopoverContent></>
                                                                }}
                                                            </Popover> */}

                                                        </Box>


                                                    })
                                                }
                                            </Box>
                                        </Flex>
                                        {video.presets && video.presets[0] && <>

                                            <Flex>
                                                <Box w="20" whiteSpace="nowrap" color="pri.dark.100">
                                                    预置位旋转 :
                                                </Box>
                                                <Box color="pri.dark.500" >
                                                    <RadioGroup isDisabled={video.presets[0].presetId === null} onChange={(val) => {
                                                        // const url = '/cx-alarm/device/manager/changeRotatable'
                                                        changeRotatable(video.presets[0].id, Number(val))
                                                    }} value={video.rotatable !== null && video.rotatable !== undefined ? String(video.rotatable) : undefined}>
                                                        <Radio mr="1" value='1'>启用</Radio>
                                                        <Radio value='0'>禁用</Radio>

                                                    </RadioGroup>
                                                </Box>
                                            </Flex>
                                        </>}


                                        {/* </SimpleGrid> */}

                                    </CardBody>
                                    {/* <CardFooter>
                                                        <Button></Button>
                                                    </CardFooter> */}
                                </Card>
                            })}


                        </SimpleGrid>
                    </Spin>

                </Box>
            </Box>

            <Box>
                <Divider my="4" />
                <Heading as='h5' size='sm'>
                    视频列表
                </Heading>

                <HStack my="2" px="4">
                    <HStack w="90" >
                        <Text >摄像机名称</Text>
                        <Input
                            w="40"
                            placeholder="请输入摄像机名称"
                            size="sm"
                            // variant="flushed"
                            onChange={(e) => {
                                setResourceName(e.target.value);
                            }}
                            value={resourceName}
                        />
                    </HStack>
                    <HStack w="90">
                        <Text >摄像机类型</Text>
                        <Select
                            w="40"

                            size="sm"
                            value={layerId}
                            onChange={(e) => setLlayerId(e.target.value)}>
                            <option value={''} >请选择摄像机类型</option>
                            {
                                Layers.map((layer) => {
                                    return <option value={layer.id} key={layer.id}>{layer.layerName}</option>

                                })
                            }
                        </Select>

                    </HStack>
                    <HStack w="120" >
                        <Text >设备编号/工艺位号</Text>
                        <Input
                            w="70"
                            placeholder="请输入设备编号/工艺位号"
                            size="sm"
                            // variant="flushed"
                            onChange={(e) => {
                                setResourceNo(e.target.value);
                            }}
                            value={resourceNo}
                        />
                    </HStack>

                    <Button
                        size="sm"

                        // h="17"
                        // color={'pri.white.100'}
                        _hover={{
                            bg: 'blue.400',
                        }}
                        // w="374px"
                        // isLoading={isSubmitting}
                        // borderRadius="32px"
                        type="button"
                        // bg="pri.blue.100"
                        //boxShadow=" 0px 3px 20px 1px #8BC9F7, inset 0px 3px 20px 1px #8BC9F7"
                        // fontSize="2xl"
                        onClick={() => {
                            setResourceName("");
                            setLlayerId("")
                            setPageState(initPage)
                            setResourceNo("")
                            getPageData('', '', '', initPage);

                        }}
                        mx="auto"
                    >
                        重置
                    </Button>
                    <Button
                        size="sm"
                        // h="17"
                        color={'pri.white.100'}
                        _hover={{
                            bg: 'blue.400',
                        }}
                        // w="374px"
                        // isLoading={isSubmitting}
                        // borderRadius="32px"
                        type="button"
                        bg="pri.blue.100"
                        //boxShadow=" 0px 3px 20px 1px #8BC9F7, inset 0px 3px 20px 1px #8BC9F7"
                        // fontSize="2xl"
                        onClick={() => { getPageData(resourceName, layerId, resourceNo, initPage) }}
                        mx="auto"
                    >
                        查询
                    </Button>
                </HStack>
                <HStack fontWeight={600} bg="pri.gray.100" px="4" py="2" textAlign="center">
                    <Box w="10">
                        序号
                    </Box>
                    <Box w="100">
                        资源名称
                    </Box>
                    <Box w="40">
                        设备编号
                    </Box>
                    <Box w="70">
                        安装位置
                    </Box>
                    <Box w="50">
                        区域
                    </Box>
                    <Box w="100">
                        预置位
                    </Box>
                </HStack>

                {
                    datas.map((data, index) => {
                        const checkedVideo = currentResPresets.find(val => val.cameraResourceId === data.id && val.presets.find((preset) => preset.presetId === null))
                        const isEmptyChecked = Boolean(checkedVideo)


                        return <HStack key={data.id} py="1" px="4" mt="2" textAlign="center" borderBottomWidth="1px" borderBottomColor="pri.gray.100">
                            <Box w="10">{index + 1}</Box>
                            <Box w="100">
                                {data.resourceName}
                            </Box>
                            <Box w="40">
                                {data.resourceNo}
                            </Box>
                            <Box w="70">
                                {data.address}
                            </Box>
                            <Box w="50">
                                {data.areaName}
                            </Box>
                            <Box w="100">
                                {/* <RadioGroup onChange={setValue} value={currentPresets[0].presetId}>
                            <Stack direction='row'> */}
                                <Checkbox
                                    isChecked={isEmptyChecked}

                                    onChange={() => {
                                        for (const item of currentPresets.filter(val => val.cameraResourceId === data.id)) {
                                            delPreset(item.id, value)
                                        }
                                        if (isEmptyChecked) {
                                            delPreset(data.id, value)
                                        } else {
                                            // 只能单选

                                            addPreset(value, [{ cameraResourceId: data.id, presetIds: [] }])

                                        }
                                    }}

                                >仅关联不选预置位</Checkbox>

                                {data.cameraPresets.map((preset) => {
                                    const currentPreset = currentPresets.find(val => val.presetId === preset.presetId)
                                    const isChecked = Boolean(currentPreset);

                                    // return    <Radio  key={preset.presetId} value={preset.presetId}>{preset.presetName}</Radio>

                                    return <Checkbox
                                        isChecked={isChecked}

                                        onChange={() => {
                                            if (currentPreset) {
                                                delPreset(currentPreset.id, value)
                                            } else {
                                                // 只能单选
                                                for (const item of currentPresets.filter(val => val.cameraResourceId === data.id)) {
                                                    delPreset(item.id, value)
                                                }
                                                addPreset(value, [{ cameraResourceId: data.id, presetIds: [preset.presetId] }])

                                            }
                                        }}

                                        key={preset.presetId} value={preset.presetId}>{preset.presetName}</Checkbox>
                                })}
                                {/* </Stack>
                                  </RadioGroup> */}
                            </Box>
                        </HStack>
                    })
                }

                <Flex w="full" h={"8"} alignItems="center" justifyContent="flex-end" pr={2} mt="2" mb="-4">
                    <Pagination
                        defaultCurrent={pageState.current}
                        size='sm'
                        current={pageState.current}
                        total={pageState.total}
                        paginationProps={{
                            display: 'flex',
                        }}
                        defaultPageSize={10}
                        onChange={(current, pages, size, total) => {
                            getPageData(resourceName, layerId, resourceNo, { ...pageState, current: current || 1, size: size || 10 });
                        }}
                        pageSize={10}
                        showTotal={(total) => (
                            <Box px="4" display="inline-flex" fontSize="14px">
                                共
                                <Text color={'pri.blue.100'} px="1">
                                    {total}
                                </Text>
                                条数据
                            </Box>
                        )}
                    />
                </Flex>
            </Box>

        </Box>
    )
}
export default FormItem({
    type: 'linkeditWithform_edit',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
})(EditModal);
