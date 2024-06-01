// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Trang chủ',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Danh sách bàn',
    path: '/dashboard/tables',
    icon: icon('ic_kanban'),
  },
  {
    title: 'Thực đơn',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Hoạt động',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Lịch sử',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
