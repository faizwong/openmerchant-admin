import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useHistory
} from 'react-router-dom';

import AdminView from '../views/admin/AdminView';
import AdminAdd from '../views/admin/AdminAdd';
import AdminDetails from '../views/admin/AdminDetails';
import AdminEdit from '../views/admin/AdminEdit';

import DiscountCodeView from '../views/discountCode/DiscountCodeView';
import DiscountCodeAdd from '../views/discountCode/DiscountCodeAdd';
import DiscountCodeDetails from '../views/discountCode/DiscountCodeDetails';
import DiscountCodeEdit from '../views/discountCode/DiscountCodeEdit';

import OrderAllView from '../views/order/OrderAllView';
import OrderDetails from '../views/order/OrderDetails';
import OrderEdit from '../views/order/OrderEdit';
import OrderShippedView from '../views/order/OrderShippedView';
import OrderToShipView from '../views/order/OrderToShipView';

import ProductView from '../views/product/ProductView';
import ProductAdd from '../views/product/ProductAdd';
import ProductDetails from '../views/product/ProductDetails';
import ProductEdit from '../views/product/ProductEdit';

import UserView from '../views/user/UserView';
import UserDetails from '../views/user/UserDetails';

const Router = (props) => {
  const { user, setUser } = props;

  return (
    <div style={outerWrapperStyle}>
      <div style={navbarWrapper}>
        <div style={navbarContainer}>
          <Navbar user={user} setUser={setUser} />
        </div>
      </div>
      <div style={contentWrapper} className='has-background-white-ter'>
        <div style={contentContainer}>

          <Switch>

            {/* product */}
            <Route exact path='/products'>
              <ProductView />
            </Route>
            <Route exact path='/products/add'>
              <ProductAdd />
            </Route>
            <Route exact path='/products/:productId'>
              <ProductDetails />
            </Route>
            <Route exact path='/products/:productId/edit'>
              <ProductEdit />
            </Route>

            {/* discountCode */}
            <Route exact path='/discount-codes'>
              <DiscountCodeView />
            </Route>
            <Route exact path='/discount-codes/add'>
              <DiscountCodeAdd />
            </Route>
            <Route exact path='/discount-codes/:discountCodeId'>
              <DiscountCodeDetails />
            </Route>
            <Route exact path='/discount-codes/:discountCodeId/edit'>
              <DiscountCodeEdit />
            </Route>

            {/* order */}
            <Route exact path='/orders/all'>
              <OrderAllView />
            </Route>
            <Route exact path='/orders/shipped'>
              <OrderShippedView />
            </Route>
            <Route exact path='/orders/to-ship'>
              <OrderToShipView />
            </Route>
            <Route exact path='/orders/:orderId'>
              <OrderDetails />
            </Route>
            <Route exact path='/orders/:orderId/edit'>
              <OrderEdit />
            </Route>

            {/* user */}
            <Route exact path='/users'>
              <UserView />
            </Route>
            <Route exact path='/users/:userId'>
              <UserDetails />
            </Route>

            {/* admin */}
            <Route exact path='/admins'>
              <AdminView />
            </Route>
            <Route exact path='/admins/add'>
              <AdminAdd />
            </Route>
            <Route exact path='/admins/:adminId'>
              <AdminDetails />
            </Route>
            <Route exact path='/admins/:adminId/edit'>
              <AdminEdit />
            </Route>

            {/* fallback */}
            <Redirect to='/products' />
          </Switch>

        </div>
      </div>
    </div>
  );
};

const Navbar = (props) => {
  const { user, setUser } = props;

  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({});
    history.push('/');
  };

  return (
    <div className='menu'>

      <p className='menu-label'>Orders</p>
      <ul className='menu-list'>
        <li>
          <NavLink
            to='/orders/to-ship'
            activeClassName='is-active'
          >
            To ship
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/orders/shipped'
            activeClassName='is-active'
          >
            Shipped
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/orders/all'
            activeClassName='is-active'
          >
            All
          </NavLink>
        </li>
      </ul>

      <p className='menu-label'>Shop</p>
      <ul className='menu-list'>
        <li>
          <NavLink
            to='/products'
            activeClassName='is-active'
          >
            Product
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/discount-codes'
            activeClassName='is-active'
          >
            Discount Code
          </NavLink>
        </li>
      </ul>

      <p className='menu-label'>Staff</p>
      <ul className='menu-list'>
        <li>
          <NavLink
            to='/users'
            activeClassName='is-active'
          >
            User
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/admins'
            activeClassName='is-active'
          >
            Admin
          </NavLink>
        </li>
      </ul>
      
      <div className='message mt-6'>
        <div className='message-body'>
          <div className='block'>
            <p className='is-size-7 has-text-weight-bold'>You are logged in as</p>
            <p className='is-size-7'>{user.email}</p>
          </div>
          <div className='block'>
            <button
              type='button'
              onClick={handleLogout}
              className='button is-small is-fullwidth'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const outerWrapperStyle = {
  position: 'absolute',
  width: '100vw',
  height: '100vh'
};

const navbarWrapper = {
  width: '260px',
  height: '100%',
  overflowY: 'scroll',
  position: 'absolute',
  top: '0',
  left: '0'
};

const navbarContainer = {
  width: '90%',
  margin: 'auto',
  marginTop: '2rem'
};

const contentWrapper = {
  width: 'calc(100vw - 260px)',
  height: '100%',
  overflowY: 'scroll',
  position: 'absolute',
  top: '0',
  left: '260px'
};

const contentContainer = {
  width: '90%',
  margin: 'auto',
  marginTop: '2rem',
  marginBottom: '2rem'
};

export default Router;
