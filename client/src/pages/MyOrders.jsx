import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Package,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  AlertCircle,
  MapPin,
  Banknote,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await api.get('/orders/my-orders');
      if (response.data?.success) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Unable to fetch your order history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Color-coded badge helper based on specification
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: CheckCircle,
          label: 'Confirmed',
        };
      case 'shipped':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          icon: Truck,
          label: 'Shipped',
        };
      case 'delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CheckCircle,
          label: 'Delivered',
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: AlertCircle,
          label: 'Cancelled',
        };
      case 'pending':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: Clock,
          label: 'Pending Confirmation',
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(d);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              Order History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track the progress, delivery, and item breakdown of your Cash on Delivery orders.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={loading || refreshing}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{refreshing ? 'Updating...' : 'Refresh Orders'}</span>
          </button>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="h-5 bg-slate-200 rounded w-48" />
                  <div className="h-6 bg-slate-200 rounded-full w-24" />
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No Orders Placed Yet</h2>
            <p className="text-slate-500 text-sm mt-1.5 mb-6">
              When you place orders via Cash on Delivery, they will show up here along with live status tracking.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              <span>Explore Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        #{order._id}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <BadgeIcon className="w-3.5 h-3.5" />
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Items breakdown */}
                  <div className="p-6">
                    <div className="divide-y divide-slate-100">
                      {(order.products || []).map((item, idx) => (
                        <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
                            }
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Quantity: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-slate-900">
                              ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer summary bar */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 -mx-6 -mb-6 p-6">
                      {/* Shipping details snippet */}
                      <div className="flex items-start gap-2.5 text-xs text-slate-600">
                        <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-800">
                            Deliver to: {order.shippingAddress?.name || 'Customer'} ({order.shippingAddress?.phone || 'Phone not recorded'})
                          </p>
                          <p className="text-slate-500">
                            {order.shippingAddress?.address ? `${order.shippingAddress.address}, ` : ''}
                            {order.shippingAddress?.city || 'City'}, {order.shippingAddress?.pincode || ''}
                          </p>
                        </div>
                      </div>

                      {/* Payment & Grand Total */}
                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-700">
                          <Banknote className="w-3.5 h-3.5" />
                          <span>Cash on Delivery</span>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-medium">Grand Total</p>
                          <p className="text-lg font-extrabold text-slate-900">
                            ${Number(order.totalAmount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
