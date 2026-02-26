import Link from 'next/link';

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: 'Каталог', href: '/catalog' },
      { name: 'Новинки', href: '/catalog?sort=new' },
      { name: 'Спецпредложения', href: '/catalog?featured=true' },
      { name: 'Колесо Фортуны', href: '/fortune-wheel' },
    ],
    info: [
      { name: 'О нас', href: '/about' },
      { name: 'Доставка и оплата', href: '/shipping' },
      { name: 'Возврат и обмен', href: '/returns' },
      { name: 'Гарантия', href: '/warranty' },
    ],
    support: [
      { name: 'Контакты', href: '/contacts' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Политика конфиденциальности', href: '/privacy' },
      { name: 'Пользовательское соглашение', href: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'Telegram', href: 'https://t.me/rejuvena', icon: '📱' },
    { name: 'VK', href: 'https://vk.com/rejuvena', icon: '🔵' },
    { name: 'WhatsApp', href: 'https://wa.me/79001234567', icon: '💬' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-white">Seplitza</span>
            </div>
            <p className="text-sm mb-4">
              Интернет-магазин сопутствующих товаров для омоложения. 
              Эффективные решения для вашей красоты и молодости.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-110 transition-transform"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Магазин</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Seplitza. Все права защищены.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Принимаем к оплате:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1 text-xs font-semibold">💳 Карты</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-semibold">🇷🇺 СБП</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
