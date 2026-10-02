import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      {/* Features Bar */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Cash On Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay safely after inspecting your package</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Free Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Prompt doorstep fulfillment nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Order Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time status updates in My Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-white">ShopMart E-Commerce</span>
          <span className="text-xs text-slate-500">MERN Stack Demo</span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium">
          <Link to="/products" className="hover:text-white transition-colors">
            Catalog
          </Link>
          <Link to="/checkout" className="hover:text-white transition-colors">
            Checkout (COD)
          </Link>
          <Link to="/my-orders" className="hover:text-white transition-colors">
            Order History
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} ShopMart. Built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
