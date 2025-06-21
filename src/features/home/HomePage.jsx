import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para navegação
import "tailwindcss/tailwind.css"; // Importando Tailwind CSS
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegação

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false); // fecha menu móvel se estiver aberto
    }
  };

  return (
    <div className="min-h-screen font-['Inter'] bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-boxes text-blue-500 text-2xl mr-2"></i>
                <span className="text-xl font-bold text-blue-600">
                  StockManager
                </span>
              </div>
            </div>

            {/* Menu desktop com ícones */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
              <button
                onClick={() => scrollToSection("produtos-section")}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium space-x-1"
              >
                <i className="fas fa-box-open text-base"></i>
                <span>Produtos</span>
              </button>
              <button
                onClick={() => scrollToSection("categorias-section")}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium space-x-1"
              >
                <i className="fas fa-tags text-base"></i>
                <span>Categorias</span>
              </button>
              <button
                onClick={() => scrollToSection("fornecedores-section")}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium space-x-1"
              >
                <i className="fas fa-truck text-base"></i>
                <span>Fornecedores</span>
              </button>
              <button
                onClick={() => scrollToSection("movimentacoes-section")}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium space-x-1"
              >
                <i className="fas fa-exchange-alt text-base"></i>
                <span>Movimentações</span>
              </button>
              <button
                onClick={() => navigate("/login")} // Redireciona para rota /login
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <i className="fas fa-right-to-bracket text-sm"></i>
                <span>Login</span>
              </button>
            </div>

            {/* Botão menu mobile */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="Abrir menu móvel"
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu com ícones */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => scrollToSection("produtos-section")}
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 space-x-2"
              >
                <i className="fas fa-box-open"></i>
                <span>Produtos</span>
              </button>
              <button
                onClick={() => scrollToSection("categorias-section")}
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 space-x-2"
              >
                <i className="fas fa-tags"></i>
                <span>Categorias</span>
              </button>
              <button
                onClick={() => scrollToSection("fornecedores-section")}
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 space-x-2"
              >
                <i className="fas fa-truck"></i>
                <span>Fornecedores</span>
              </button>
              <button
                onClick={() => scrollToSection("movimentacoes-section")}
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 space-x-2"
              >
                <i className="fas fa-exchange-alt"></i>
                <span>Movimentações</span>
              </button>
              <button
                onClick={() => navigate("/login")} // Redireciona para /login no menu mobile
                className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors mt-2 space-x-2"
              >
                <i className="fas fa-right-to-bracket"></i>
                <span>Login</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main */}
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="text-center py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Controle de Estoque{" "}
              <span className="text-blue-600">Simplificado</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gerencie seu inventário com precisão e facilidade usando o
              StockMaster
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg"
              >
                Comece Agora
              </button>
              <button
                onClick={() => scrollToSection("funcionalidades")}
                className="border border-gray-300 hover:border-blue-500 text-gray-700 px-6 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Saiba Mais
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="funcionalidades" className="mt-8 mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como podemos te ajudar?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra as principais funcionalidades do StockMaster
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: "produtos-section",
                icon: "fas fa-box-open",
                title: "Produtos",
                desc: "Gerencie seu estoque de produtos com facilidade.",
                moreText: "Saiba mais →",
              },
              {
                id: "categorias-section",
                icon: "fas fa-tags",
                title: "Categorias",
                desc: "Organize seus produtos em categorias personalizadas.",
              },
              {
                id: "fornecedores-section",
                icon: "fas fa-truck",
                title: "Fornecedores",
                desc: "Mantenha o cadastro dos seus fornecedores atualizado.",
              },
              {
                id: "movimentacoes-section",
                icon: "fas fa-exchange-alt",
                title: "Movimentações",
                desc: "Controle entradas e saídas de estoque de forma rápida.",
              },
            ].map((card, i) => (
              <div
                key={i}
                onClick={() => scrollToSection(card.id)}
                className="cursor-pointer transition-all duration-300 card-hover bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:border-blue-300 border-2 border-transparent"
              >
                <div
                  className={`p-5 rounded-full mb-6 ${
                    i === 0 ? "bg-blue-100" : "bg-blue-50"
                  }`}
                >
                  <i
                    className={`${card.icon} text-blue-600 ${
                      i === 0 ? "text-3xl" : "text-2xl"
                    }`}
                  ></i>
                </div>
                <h3
                  className={`${
                    i === 0 ? "text-xl font-bold" : "text-lg font-semibold"
                  } text-gray-800 mb-3`}
                >
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4">{card.desc}</p>
                {card.moreText && (
                  <span className="text-blue-600 font-medium mt-auto">
                    {card.moreText}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Por que escolher o StockMaster?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A solução completa para gestão de estoque que sua empresa
                precisa
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <i className="fas fa-bolt text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Rápido e Intuitivo
                </h3>
                <p className="text-gray-600">
                  Interface simples que qualquer pessoa pode usar sem
                  treinamento complexo.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <i className="fas fa-chart-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Relatórios Poderosos
                </h3>
                <p className="text-gray-600">
                  Tenha insights valiosos sobre seu estoque com relatórios
                  detalhados.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <i className="fas fa-mobile-alt text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Acesso em Qualquer Lugar
                </h3>
                <p className="text-gray-600">
                  Acesse seu estoque de qualquer dispositivo, a qualquer
                  momento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section
          id="produtos-section"
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-xl p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-box-open text-blue-600 mr-3"></i> Gestão de
              Produtos
            </h2>
            <p className="text-gray-600 mb-4">No StockMaster, você pode:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Cadastrar novos produtos com informações completas</li>
              <li>Visualizar o estoque atual de cada item</li>
              <li>Definir níveis mínimos de estoque para alertas</li>
              <li>Buscar produtos por nome, código ou categoria</li>
              <li>Exportar relatórios de inventário</li>
            </ul>
          </div>
        </section>

        <section
          id="categorias-section"
          className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-tags text-blue-600 mr-3"></i> Categorias de
              Produtos
            </h2>
            <p className="text-gray-600 mb-4">
              Organize seu estoque com nosso sistema de categorias:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Crie categorias e subcategorias ilimitadas</li>
              <li>Atribua produtos a múltiplas categorias</li>
              <li>Filtre produtos por categoria</li>
              <li>Gere relatórios por grupo de produtos</li>
              <li>Personalize com cores e ícones para fácil identificação</li>
            </ul>
          </div>
        </section>

        <section
          id="fornecedores-section"
          className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-truck text-blue-600 mr-3"></i> Fornecedores
            </h2>
            <p className="text-gray-600 mb-4">
              Gerencie seus parceiros comerciais:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Cadastro completo de fornecedores</li>
              <li>Histórico de compras por fornecedor</li>
              <li>Avaliação e classificação de fornecedores</li>
              <li>Contatos e informações de contato</li>
              <li>Integração com pedidos de compra</li>
            </ul>
          </div>
        </section>

        <section
          id="movimentacoes-section"
          className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-exchange-alt text-blue-600 mr-3"></i>{" "}
              Movimentações
            </h2>
            <p className="text-gray-600 mb-4">
              Controle completo do fluxo de estoque:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Registro de entradas (compras, devoluções)</li>
              <li>Registro de saídas (vendas, perdas)</li>
              <li>Ajustes de inventário</li>
              <li>Histórico completo com data e responsável</li>
              <li>Relatórios de movimentação por período</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <i className="fas fa-boxes text-blue-500 text-2xl mr-2"></i>
                <span className="text-xl font-bold text-blue-600">
                  StockMaster
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                A solução completa para gestão de estoque que sua empresa
                precisa.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Links Rápidos
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("produtos-section")}
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("produtos-section")}
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    Produtos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("categorias-section")}
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    Categorias
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("fornecedores-section")}
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    Fornecedores
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Suporte
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 text-sm"
                  >
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Newsletter
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Assine nossa newsletter para receber atualizações.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Obrigado por assinar!");
                }}
                className="flex"
              >
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  className="px-3 py-2 border border-gray-300 rounded-l-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              &copy; 2023 StockMaster. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
