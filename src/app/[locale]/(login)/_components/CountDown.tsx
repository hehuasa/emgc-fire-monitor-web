/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCountDown } from 'ahooks';
import React from 'react'

const CountDown = ({ callBack, leftTime }: { callBack: () => void, leftTime: number }) => {
    console.info('============leftTime==============', leftTime);
    const [countdown] = useCountDown({
        leftTime: leftTime,
        onEnd: () => {
            if (callBack) {
                callBack()
            }
        },
    });

    return (
        <div>
            <span className="countdown">
                {/* @ts-ignore */}
                <span className='mr-1' style={{ "--value": countdown / 1000 }}></span> </span>S
        </div>

    )
}

export default CountDown