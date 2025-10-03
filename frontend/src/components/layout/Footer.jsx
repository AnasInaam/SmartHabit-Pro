import { Link } from 'react-router-dom'
import { Target, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Heart } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'How it Works', href: '/about' },
      { name: 'FAQ', href: '/contact' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/about' },
      { name: 'Blog', href: '/about' }
    ],
    resources: [
      { name: 'Help Center', href: '/contact' },
      { name: 'Community', href: '/about' },
      { name: 'Guides', href: '/about' },
      { name: 'API Docs', href: '/about' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/about' },
      { name: 'Terms of Service', href: '/about' },
      { name: 'Cookie Policy', href: '/about' },
      { name: 'GDPR', href: '/about' }
    ]
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SmartHabit</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transform your life with science-backed habit tracking. Build lasting habits, achieve your goals, and become your best self.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href="mailto:support@smarthabit.com" className="hover:text-primary-400 transition-colors">
                  support@smarthabit.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href="tel:+15551234567" className="hover:text-primary-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>123 Innovation Drive<br />San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="max-w-md mx-auto md:mx-0">
            <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for tips, updates, and exclusive content.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-secondary-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p className="flex items-center justify-center md:justify-end gap-1">
                © {currentYear} SmartHabit. Made with
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                in San Francisco
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Gradient */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-1"></div>
    </footer>
  )
}

export default Footer
