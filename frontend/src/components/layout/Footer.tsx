const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo y descripción */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Librería</h3>
                <p className="text-sm text-gray-600">Tu librería de confianza</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6">
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200"
              >
                Términos
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200"
              >
                Privacidad
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200"
              >
                Soporte
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © {currentYear} Librería. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
