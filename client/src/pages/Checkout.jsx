import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Truck,
  Banknote,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Package,
} from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart, loadSampleCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name && !shippingAddress.name) {
      setShippingAddress((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!shippingAddress.name.trim()) {
      errs.name = 'Recipient name is required';
    }
    if (!shippingAddress.phone.trim()) {
      errs.phone = 'Contact phone number is required';
    } else if (!/^[+0-9\s-]{7,15}$/.test(shippingAddress.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!shippingAddress.address.trim()) {
      errs.address = 'Street address is required';
    }
    if (!shippingAddress.city.trim()) {
      errs.city = 'City is required';
    }
    if (!shippingAddress.pincode.trim()) {
      errs.pincode = 'Postal pincode / ZIP code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your shopping cart is empty.');
      return;
    }

    if (!validate()) {
      toast.error('Please complete all required shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          name: shippingAddress.name.trim(),
          phone: shippingAddress.phone.trim(),
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          pincode: shippingAddress.pincode.trim(),
        },
      };

      const response = await api.post('/orders', payload);
      const resData = response.data;

      if (resData?.success) {
        clearCart();
        toast.success(resData.message || 'Order placed successfully with Cash on Delivery!');
        navigate('/my-orders');
      } else {
        throw new Error(resData?.message || 'Failed to place order');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error occurred while placing order';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            You don't have any items in your cart to checkout. Add some products or load sample items to test the Cash on Delivery flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={loadSampleCart}
              className="py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Load Sample Cart Items
            </button>
            <Link
              to="/products"
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-8 h-8 text-indigo-600" />
            Checkout & Shipping
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete your delivery details to confirm your Cash on Delivery order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shipping Form & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Shipping Address Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
                  <p className="text-xs text-slate-500">Where should we deliver your order?</p>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-4" noValidate>
                {/* Recipient Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Recipient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="shipping-name"
                      type="text"
                      name="name"
                      value={shippingAddress.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.name
                          ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20 text-rose-900'
                          : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-600 bg-slate-50/50 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>}
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="shipping-phone"
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 555-019-2834"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20 text-rose-900'
                          : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-600 bg-slate-50/50 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>}
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Street Address & Apartment / Unit <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      id="shipping-address"
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleChange}
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.address
                          ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20 text-rose-900'
                          : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-600 bg-slate-50/50 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.address}</p>}
                </div>

                {/* City & Pincode Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        id="shipping-city"
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        placeholder="e.g. Springfield"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.city
                            ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20 text-rose-900'
                            : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-600 bg-slate-50/50 focus:bg-white'
                        }`}
                      />
                    </div>
                    {errors.city && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city}</p>}
                  </div>

                  {/* Postal Pincode */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Postal Pincode / ZIP <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        id="shipping-pincode"
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 97477"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.pincode
                            ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20 text-rose-900'
                            : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-600 bg-slate-50/50 focus:bg-white'
                        }`}
                      />
                    </div>
                    {errors.pincode && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.pincode}</p>}
                  </div>
                </div>
              </form>
            </div>

            {/* Step 2: Payment Method (Fixed to Cash on Delivery) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                  <p className="text-xs text-slate-500">Secure doorstep settlement</p>
                </div>
              </div>

              {/* Selected Payment Method Card */}
              <div className="p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50/30 flex items-start gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-sm shrink-0">
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-base">Cash on Delivery (COD)</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3.5 h-3.5" /> Selected
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Pay in cash upon doorstep package receipt. No advance online card payment required.
                  </p>
                </div>
              </div>

              {/* Security & Delivery Notice Banner */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center gap-3 text-xs text-slate-600">
                <Truck className="w-5 h-5 text-indigo-500 shrink-0" />
                <span>
                  Our delivery courier will verify package contents with you prior to collecting the cash payment.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 sm:p-7">
              <h2 className="text-lg font-bold text-slate-900 pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </h2>

              {/* Items List Breakdown */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1 mb-5">
                {cartItems.map((item) => (
                  <div key={item.product} className="py-3.5 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Qty: <span className="font-semibold text-slate-600">{item.quantity}</span> × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Totals */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Shipping</span>
                  <span className="font-medium text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Handling (COD)</span>
                  <span className="font-medium text-emerald-600">FREE</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-slate-900">Total Payable</span>
                    <p className="text-xs text-slate-400">Cash due at delivery</p>
                  </div>
                  <span className="text-2xl font-extrabold text-indigo-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                id="place-order-button"
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="mt-6 w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order (Cash on Delivery)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Safe Checkout Guarantee */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero advance risk • Pay after package arrives</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
