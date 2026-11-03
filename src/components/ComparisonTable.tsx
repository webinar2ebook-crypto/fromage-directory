import React from 'react';
import { Cheese } from '../data/cheeses';
import { ArrowRight } from 'lucide-react';

interface ComparisonTableProps {
  cheeses: Cheese[];
  onSelectCheese: (cheese: Cheese) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  cheeses,
  onSelectCheese,
}) => {
  return (
    <section id="comparison" className="mt-16 scroll-mt-24">
      <div className="mb-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-amber-800">
          At a Glance
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Cheese Characteristics Comparison
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Compare the three world-renowned cheeses across origin, milk classification, texture, and maturation.
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-stone-200/90 shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/75 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <th scope="col" className="p-4 sm:p-5">Cheese</th>
              <th scope="col" className="p-4 sm:p-5">Country & Region</th>
              <th scope="col" className="p-4 sm:p-5">Milk Type</th>
              <th scope="col" className="p-4 sm:p-5">Aging Period</th>
              <th scope="col" className="p-4 sm:p-5">Texture Profile</th>
              <th scope="col" className="p-4 sm:p-5 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-normal">
            {cheeses.map((cheese) => (
              <tr
                key={cheese.id}
                className="hover:bg-amber-50/30 transition-colors group cursor-pointer"
                onClick={() => onSelectCheese(cheese)}
              >
                <td className="p-4 sm:p-5">
                  <div className="font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cheese.name}
                  </div>
                  <div className="text-xs text-stone-400 italic">
                    {cheese.moniker}
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-stone-700 whitespace-nowrap">
                  <span className="mr-1.5">{cheese.flag}</span>
                  <span className="font-medium">{cheese.country}</span>
                  <div className="text-xs text-stone-400">{cheese.region.split('(')[0].trim()}</div>
                </td>
                <td className="p-4 sm:p-5 text-stone-600">
                  {cheese.milk.split('(')[0].trim()}
                </td>
                <td className="p-4 sm:p-5 text-stone-600 tabular-nums font-mono text-xs">
                  {cheese.aging}
                </td>
                <td className="p-4 sm:p-5 text-stone-600 max-w-xs truncate">
                  {cheese.texture}
                </td>
                <td className="p-4 sm:p-5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCheese(cheese);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
