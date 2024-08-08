'use client';
import { Box, Text, HStack, Checkbox } from '@chakra-ui/react';

import React, { useRef } from 'react';
import Null from '@/assets/layout/null.png';
import Image from 'next/image';
import useVirtual from 'react-cool-virtual';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deviceListModel, selectDeviceIdsModel } from '@/models/sms';
// import LoadingComponent from '@/components/Loading';

export interface leftTableRowType {
	resourceName: string;
	resourceNo: string;
	iotDeviceId: string;
	iotSubDeviceId: string;
	id: string;
	areaId: string;
	cellId: string;
	deptId: string;
}

export type tableRequest<T> = {
	current: number;
	pages: number;
	records: [T];
	size: number;
	total: number;
};

const RuleTable = () => {
	const data = useRecoilValue(deviceListModel);
	const [deviceIds, setDeviceIds] = useRecoilState(selectDeviceIdsModel);
	const isChecked = deviceIds.length > 0 && data.length === deviceIds.length;
	const isIndeterminate = deviceIds.length > 0 && data.length > deviceIds.length;

	const scrollRef = useRef<HTMLDivElement | null>(null);
	const { outerRef, innerRef, items } = useVirtual<HTMLDivElement, HTMLDivElement>({
		itemCount: data.length,
		resetScroll: true,
		// useIsScrolling: true,
	});

	const handleChange = (item: leftTableRowType) => {
		const checkedDeviceIdsCache = [...deviceIds];
		const index = checkedDeviceIdsCache.findIndex((val) => val === item.id);
		if (index === -1) {
			checkedDeviceIdsCache.push(item.id);
		} else {
			checkedDeviceIdsCache.splice(index, 1);
		}

		setDeviceIds(checkedDeviceIdsCache);
	};

	const handleAllChange = (allChecked: boolean) => {
		if (allChecked) {
			setDeviceIds([]);
		} else {
			const array = [];
			for (const { id } of data) {
				array.push(id);
			}
			setDeviceIds(array);
		}
	};

	return (
		<Box
			w={'full'}
			h={'50vh'}
			overflow={'hidden'}
			pos={'relative'}
			border={'1px solid'}
			borderColor={'pri.gray.200'}
			borderRadius={'10px'}
		>
			{data.length == 0 ? (
				<Box textAlign="center" width={'48'} m="auto">
					<Image src={Null} quality="100" objectFit="cover" alt="空状态" />
					<Text fontSize={'16px'} color="font.100">
						暂无数据
					</Text>
				</Box>
			) : (
				<>
					<HStack py={4} h={6} pos={'sticky'} top={0} bg={'#F4F6F7'} zIndex={99}>
						<HStack pl={2} alignItems={'center'} justifyContent={'center'}>
							<Checkbox
								isChecked={isChecked}
								isIndeterminate={isIndeterminate}
								onChange={() => {
									handleAllChange(isChecked);
								}}
							></Checkbox>
							<span>全选</span>
						</HStack>
						<Box pl={10} w={40}>
							点位名称
						</Box>
						<Box pl={10} w={40}>
							点位编号
						</Box>
					</HStack>
					<Box
						h={'90%'}
						flex={1}
						overflow="overlay"
						ref={(el) => {
							outerRef.current = el;
							scrollRef.current = el;
						}}
						layerStyle="scrollbarStyle"
					>
						<Box
							color="font.100"
							ml="3.5"
							ref={(el) => {
								innerRef.current = el;
								scrollRef.current = el;
							}}
						>
							{items.map(({ index, measureRef }) => {
								const item = data[index];
								if (!item) {
									return null;
								}

								return (
									<HStack key={item.id} ref={measureRef}>
										<Checkbox
											w={15}
											colorScheme="blue"
											isChecked={deviceIds.includes(item.id)}
											onChange={() => handleChange(item)}
										/>
										<Box
											w={40}
											ml={'25px'}
											whiteSpace={'nowrap'}
											textOverflow={'ellipsis'}
											overflow={'hidden'}
										>
											{item.resourceName}
										</Box>
										<Box w={40} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
											{item.resourceNo}
										</Box>
									</HStack>
								);
							})}
						</Box>
					</Box>
				</>
			)}
		</Box>
	);
};

export default RuleTable;
