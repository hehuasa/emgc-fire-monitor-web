/*
   判断当前页面是否有菜单权限的hooks
   返回一个函数
   通过传入平铺的菜单来判断当前的路由是否有权限
*/

import { IMenuItem } from '@/models/user';
import { useMemoizedFn } from 'ahooks';
import { useRouter, usePathname } from 'next/navigation';

const useMenuAuthor = () => {
  const router = useRouter();
  const pathname = usePathname();
  const estimateMenuAuthor = useMemoizedFn((menu: IMenuItem[]) => {
    const isAuthor = !!menu.find((item) => pathname?.includes(item.url));
    if (!isAuthor) {
      // router.push('/login');
    }
  });

  return { estimateMenuAuthor };
};

export default useMenuAuthor;
