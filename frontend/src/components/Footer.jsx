import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 text-center text-gray-700 text-sm font-bold bg-transparent">
      <div className="container mx-auto">
        <p>
          &copy; {currentYear} Todos los derechos reservados.
          <span className="mx-2">|</span>
          Versión 0.5 ERP COAD
          <span className="mx-2">|</span>
          Creado por{" "}
          <a
            href="https://www.linkedin.com/in/angelguadalupe19/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline transition-colors duration-200"
          >
            Angel Guadalupe
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;