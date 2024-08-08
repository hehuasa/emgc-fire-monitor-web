import { getData } from '@/components/LargeScreenApi/getApi';

export default class TaskQueue {
  max: number;
  currentRunning: number;
  taskList: Array<any>;
  constructor(max: number) {
    this.max = max;
    this.currentRunning = 0;
    this.taskList = [];
  }

  // 将请求封装成一个函数，推入队列，并尝试执行
  enqueue(url: string) {
    console.log('url111', url);
    return new Promise((resolve, reject) => {
      const task = () => {
        // 当请求开始时，currentRunning 加 1
        this.currentRunning++;
        this.sendRequest(url)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            // 请求结束后，currentRunning 减 1，并尝试执行下一个请求
            this.currentRunning--;
            this.dequeue();
          });
      };
      this.taskList.push(task);
      this.dequeue(); // 每次添加请求后尝试执行请求
    });
  }

  dequeue() {
    // 如果当前运行的请求小于最大并发数，并且队列中有待执行的请求
    if (this.currentRunning < this.max && this.taskList.length) {
      // 从队列中取出一个请求并执行
      const task = this.taskList.shift();
      task();
    }
  }

  // 这个函数是模拟发送请求的，实际中你可能需要替换成真实的请求操作
  sendRequest(url: string) {
    console.log(`Sending request to ${url}`);
    return new Promise((resolve) => {
      // setTimeout(() => {
      //   console.log(`Response received from ${url}`);
      //   resolve(`Result from ${url}`);
      // }, Math.random() * 2000); // 随机延时以模拟请求处理时间

      getData(url);
    });
  }
}
