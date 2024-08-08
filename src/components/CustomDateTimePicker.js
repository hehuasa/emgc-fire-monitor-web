import React from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/zh-cn';
import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react';
import { ArrowBackIcon, SmallCloseIcon } from '@chakra-ui/icons';

/**
 *
 */
export default class CustomDateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ],
      minutes: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '47',
        '48',
        '49',
        '50',
        '51',
        '52',
        '53',
        '54',
        '55',
        '56',
        '57',
        '58',
        '59',
      ],
      seconds: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '47',
        '48',
        '49',
        '50',
        '51',
        '52',
        '53',
        '54',
        '55',
        '56',
        '57',
        '58',
        '59',
      ],
      dateValue: null,
    };
  }

  handleBack = () => {
    // eslint-disable-next-line react/no-string-refs
    this.refs.datetime.navigate('days');
  };

  handleClickHour = (hour) => {
    this.setState({
      dateValue: this.state.dateValue.set('hour', hour),
    });
  };
  handleClicMinute = (minute) => {
    this.setState({
      dateValue: this.state.dateValue.set('minute', minute),
    });
  };
  handleClicSecond = (second) => {
    this.setState({
      dateValue: this.state.dateValue.set('second', second),
    });
  };
  handleChange = (momentVal) => {
    this.setState({
      dateValue: momentVal,
    });
  };
  handleClose = () => {
    this.handleBack();
    if (this.state.dateValue) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.datetime.setState({
        open: false,
        selectedDate: this.state.dateValue,
        inputValue: this.state.dateValue.format('YYYY-MM-DD HH:mm:ss'),
        viewDate: this.state.dateValue,
      });
      this.props.onChange(this.state.dateValue);
    }
  };
  handleSubmit = () => {
    this.handleBack();
    if (this.state.dateValue) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.datetime.setState({
        open: false,
        selectedDate: this.state.dateValue,
        inputValue: this.state.dateValue.format('YYYY-MM-DD HH:mm:ss'),
        viewDate: this.state.dateValue,
      });
      this.props.onChange(this.state.dateValue);
    }
  };

  renderInput = (props, openCalendar, closeCalendar) => {
    const { ...rest } = this.props;
    console.log('props', props);
    function clear() {
      props.onChange({ target: { value: '' } });
    }
    // this.onInputChange = props.onChange;

    return (
      <Box w={'full'} h={'100%'}>
        <InputGroup>
          <Input
            autoComplete="none"
            placeholder="请选择时间"
            {...rest}
            fontSize={'lg'}
            margin={0}
            {...props}
          />
          {props.value && (
            <InputRightElement h={this.props.h} margin={0} right={2}>
              <Icon
                as={SmallCloseIcon}
                w={4}
                h={4}
                borderRadius={'50%'}
                bg={'pri.gray.100'}
                color={'pri.black.100'}
                cursor={'pointer'}
                onClick={clear}
              ></Icon>
            </InputRightElement>
          )}
        </InputGroup>
      </Box>
    );
  };

  renderView = (mode, renderDefault) => {
    if (mode === 'time') {
      return (
        <Flex
          w={'inherit'}
          h={'347px'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          p={2}
        >
          <Box pt={2} onClick={() => this.handleBack()}>
            <Icon as={ArrowBackIcon} fontSize={'lg'} cursor={'pointer'}></Icon>
          </Box>
          <HStack h={'80%'} justifyContent={'center'}>
            <Box w={'12'} h={'full'} overflowY={'auto'}>
              {this.state.hours.map((hour, i) => (
                <Text
                  key={i}
                  _hover={{
                    bg: 'pri.gray.200',
                    cursor: 'pointer',
                  }}
                  onClick={() => this.handleClickHour(i)}
                >
                  {hour}
                </Text>
              ))}
            </Box>
            <Box w={'12'} h={'full'} overflowY={'auto'}>
              {this.state.minutes.map((minute, i) => (
                <Text
                  key={i}
                  _hover={{
                    bg: 'pri.gray.200',
                    cursor: 'pointer',
                  }}
                  onClick={() => this.handleClicMinute(i)}
                >
                  {minute}
                </Text>
              ))}
            </Box>
            <Box w={'12'} h={'full'} overflowY={'auto'}>
              {this.state.seconds.map((second, i) => (
                <Text
                  key={i}
                  _hover={{
                    bg: 'pri.gray.200',
                    cursor: 'pointer',
                  }}
                  onClick={() => this.handleClicSecond(i)}
                >
                  {second}
                </Text>
              ))}
            </Box>
          </HStack>
          <HStack mt={2} justifyContent={'flex-end'} textAlign={'center'}>
            <Box
              bg={'pri.gray.100'}
              color={'black'}
              px={2}
              py={1}
              borderRadius={'6px'}
              cursor={'pointer'}
              textIndent={0}
              onClick={this.handleClose}
            >
              取消
            </Box>
            <Box
              bg={'pri.blue.100'}
              color={'white'}
              px={2}
              py={1}
              textAlign={'center'}
              borderRadius={'6px'}
              cursor={'pointer'}
              textIndent={0}
              onClick={this.handleSubmit}
            >
              确定
            </Box>
          </HStack>
        </Flex>
      );
    }
    return renderDefault();
  };

  render() {
    return (
      <Box w={'100%'} h={'100%'} borderRadius={'10px'} borderStyle={'solid'}>
        <DateTime
          className="customDateTime"
          // eslint-disable-next-line react/no-string-refs
          ref="datetime"
          locale="zh-cn"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          renderInput={this.renderInput}
          renderView={(mode, renderDefault) => this.renderView(mode, renderDefault)}
          value={this.state.dateValue}
          onChange={this.handleChange}
          onClose={this.handleClose}
        />
      </Box>
    );
  }
}
