import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShoppingCart, MessageCircle, Store, Sparkles, ArrowRight, Check, Zap, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 text-white overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              Café App
            </motion.div>
            <div className="hidden md:flex gap-8 items-center">
              <a href="#features" className="hover:text-indigo-300 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-indigo-300 transition-colors">How It Works</a>
              <a href="#benefits" className="hover:text-indigo-300 transition-colors">Benefits</a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/marketplace')}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-indigo-500/50 transition-shadow"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6 pt-24"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm">AI-Powered Shopping Experience</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Order Smarter,
              <br />
              Eat Better
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Experience the future of food ordering with AI-powered assistance, seamless checkout, and instant delivery from your favorite local cafés.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {navigate('/marketplace')}}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 rounded-full font-semibold text-lg shadow-2xl flex items-center justify-center gap-2"
              >
                Start Ordering <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {navigate('/marketplace')}}
                className="backdrop-blur-xl bg-white/10 border border-white/20 px-8 py-4 rounded-full font-semibold text-lg"
              >
                For Businesses
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Cards Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: MessageCircle, title: "AI Assistant", desc: "Smart ordering" },
                { icon: ShoppingCart, title: "Easy Checkout", desc: "One-click orders" },
                { icon: Store, title: "Local Cafés", desc: "Support local" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl"
                >
                  <item.icon className="w-12 h-12 text-indigo-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/50 rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Everything You Need,
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                All in One Place
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover powerful features designed to make ordering food effortless and enjoyable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "AI Shopping Assistant",
                description: "Chat naturally with our intelligent AI to browse menus, get recommendations, and place orders without lifting a finger.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized checkout flow gets you from craving to ordering in seconds. No complicated forms or endless clicking.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Bank-level encryption keeps your data safe. We never share your information with third parties.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Truck,
                title: "Real-Time Tracking",
                description: "Know exactly when your order will arrive with live tracking and instant notifications.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, Fast,
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Delicious
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent transform -translate-x-1/2" />

            {[
              { step: "01", title: "Browse & Discover", desc: "Explore menus from local cafés or chat with our AI for personalized recommendations" },
              { step: "02", title: "Add to Cart", desc: "One-click ordering with smart quantity controls and instant cart updates" },
              { step: "03", title: "Secure Checkout", desc: "Complete your order with our streamlined, secure payment process" },
              { step: "04", title: "Track & Enjoy", desc: "Watch your order in real-time and enjoy fresh, delicious food delivered to you" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`flex items-center gap-8 mb-16 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
                  >
                    <div className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-300 text-lg">{item.desc}</p>
                  </motion.div>
                </div>
                
                <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 items-center justify-center shadow-2xl z-10">
                  <Check className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-12 md:p-20 text-center shadow-2xl"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Join Thousands of
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Happy Customers
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Start your journey to effortless food ordering today. No commitment required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {navigate('/marketplace')}}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 px-10 py-5 rounded-full font-bold text-xl shadow-2xl"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 px-10 py-5 rounded-full font-bold text-xl"
              >
                Contact Sales
              </motion.button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-left">
              {[
                { number: "50K+", label: "Active Users" },
                { number: "200+", label: "Partner Cafés" },
                { number: "1M+", label: "Orders Delivered" },
                { number: "4.9★", label: "User Rating" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Café App
              </div>
              <p className="text-gray-400">
                Making food ordering smarter, faster, and more delightful.
              </p>
            </div>
            
            {[
              { title: "Product", links: ["Features", "Pricing", "AI Assistant", "Business"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Contact", "Status", "API Docs"] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-bold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Café App. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
