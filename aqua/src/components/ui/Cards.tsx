interface CardProps {
  title?: string;
  subtitle?: string;
  content: string;
  footer?: string;
  image?: string;
  type: "blog" | "review";
}

export const Card = ({ title, subtitle, content, footer, image, type }: CardProps) => (
  <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col gap-4 hover:border-[var(--primary)] transition-all group shadow-lg">
    {type === "blog" && image && (
      <div className="w-full h-40 rounded-lg overflow-hidden mb-2">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    )}
    
    <div>
      {type === "review" && <div className="text-[var(--primary)] text-sm mb-2">★★★★★</div>}
      {title && <h3 className="text-lg font-bold text-[var(--text-main)] leading-tight">{title}</h3>}
      {subtitle && <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{subtitle}</p>}
    </div>

    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed flex-1">
      {content}
    </p>

    {footer && (
      <div className="pt-4 border-t border-[var(--border-color)] text-[12px] font-medium text-[var(--text-main)]">
        {footer}
      </div>
    )}
  </div>
);