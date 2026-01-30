import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import '../../index.css';
import styles from './app.module.css';
import { useSelector, useDispatch } from '../../services/store';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { selectIngredients, getIngredients } from '../../services/ingredients';
import {
  getFeeds,
  selectFeedsOrders,
  selectFeedsTotal,
  selectFeedTotalToday
} from '../../services/feeds';
import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const state = location.state as { background?: Location };
  const navigate = useNavigate();
  const ingredients = useSelector(selectIngredients);
  const feedsOrders = useSelector(selectFeedsOrders);
  const feedsTotal = useSelector(selectFeedsTotal);
  const feedTotalToday = useSelector(selectFeedTotalToday);

  // console.log('ingredients = ', ingredients);
  // console.log('feedsOrders = ', feedsOrders);
  // console.log('feedsTotal = ', feedsTotal);
  // console.log('feedTotalToday = ', feedTotalToday);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getFeeds());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={''}
                onClose={function (): void {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={''}
                onClose={function (): void {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={''}
                  onClose={function (): void {
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
