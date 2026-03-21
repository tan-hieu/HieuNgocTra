import { ArrowRight, ShoppingCart } from "lucide-react";
// eslint-disable-next-line
import { motion } from "motion/react";

export default function RelatedProducts({ products = [] }) {
  return (
    <section className="py-20 border-t border-primary/10">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-primary font-display">
          Sản phẩm liên quan
        </h2>

        <a
          href="#"
          className="text-accent font-bold hover:underline font-sans flex items-center gap-2"
        >
          Xem tất cả <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F7F2E8] mb-4 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </button>

              {product.badge && (
                <span className="absolute top-4 left-4 bg-accent text-white text-[10px] px-2 py-1 rounded font-sans uppercase font-bold tracking-tighter">
                  {product.badge}
                </span>
              )}
            </div>

            <p className="text-xs font-sans text-gold font-bold uppercase tracking-widest mb-1">
              {product.category}
            </p>

            <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors font-display">
              {product.name}
            </h4>

            <p className="text-lg font-sans text-primary/80">{product.price}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
